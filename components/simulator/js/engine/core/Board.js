+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var EventEmitter = scope.EventEmitter,
    TransportEvent = scope.TransportEvent,
    Transport = scope.Transport,
    Pin = scope.Pin,
    util = scope.util,
    proto;

  var BoardEvent = {
    ANALOG_DATA: 'analogData',
    DIGITAL_DATA: 'digitalData',
    FIRMWARE_VERSION: 'firmwareVersion',
    FIRMWARE_NAME: 'firmwareName',
    STRING_MESSAGE: 'stringMessage',
    SYSEX_MESSAGE: 'sysexMessage',
    PIN_STATE_RESPONSE: 'pinStateResponse',
    READY: 'ready',
    ERROR: 'error',
    BEFOREDISCONNECT: 'beforeDisconnect',
    DISCONNECT: 'disconnect'
  };

  // Message command bytes (128-255/0x80-0xFF)
  var DIGITAL_MESSAGE = 0x90,
    ANALOG_MESSAGE = 0xE0,
    REPORT_ANALOG = 0xC0,
    REPORT_DIGITAL = 0xD0,
    SET_PIN_MODE = 0xF4,
    REPORT_VERSION = 0xF9,
    SYSEX_RESET = 0xFF,
    START_SYSEX = 0xF0,
    END_SYSEX = 0xF7;

  // Extended command set using sysex (0-127/0x00-0x7F)
  var SERVO_CONFIG = 0x70,
    STRING_DATA = 0x71,
    SHIFT_DATA = 0x75,
    I2C_REQUEST = 0x76,
    I2C_REPLY = 0x77,
    I2C_CONFIG = 0x78,
    EXTENDED_ANALOG = 0x6F,
    PIN_STATE_QUERY = 0x6D,
    PIN_STATE_RESPONSE = 0x6E,
    CAPABILITY_QUERY = 0x6B,
    CAPABILITY_RESPONSE = 0x6C,
    ANALOG_MAPPING_QUERY = 0x69,
    ANALOG_MAPPING_RESPONSE = 0x6A,
    REPORT_FIRMWARE = 0x79,
    SAMPLING_INTERVAL = 0x7A,
    SYSEX_NON_REALTIME = 0x7E,
    SYSEX_REALTIME = 0x7F;

  function Board(options) {
    EventEmitter.call(this);

    this._options = options;
    this._buf = [];
    this._digitalPort = [];
    this._numPorts = 0;
    this._analogPinMapping = [];
    this._digitalPinMapping = [];
    this._i2cPins = [];
    this._ioPins = [];
    this._totalPins = 0;
    this._totalAnalogPins = 0;
    this._samplingInterval = 19;
    this._isReady = false;
    this._firmwareName = '';
    this._firmwareVersion = 0;
    this._capabilityQueryResponseReceived = false;
    this._numPinStateRequests = 0;
    this._transport = null;
    this._pinStateEventCenter = new EventEmitter();

    this._initialVersionResultHandler = onInitialVersionResult.bind(this);
    this._openHandler = onOpen.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._errorHandler = onError.bind(this);
    this._closeHandler = onClose.bind(this);
    this._cleanupHandler = cleanup.bind(this);

    attachCleanup(this);
    var self = this;
    this._setTransport(this._options.transport);

    setTimeout(function () {
      self.startup();
    }, 0);
  }

  function onInitialVersionResult(event) {
    var version = event.version * 10,
      name = event.name;

    if (version >= 23) {
      // TODO: do reset and handle response
      // this.systemReset();
      this.queryCapabilities();
    } else {
      throw new Error('You must upload StandardFirmata version 2.3 ' +
        'or greater from Arduino version 1.0 or higher');
    }
  }

  function onOpen() {
    this.begin();
  }

  function onMessage(data) {
    console.log("board onMessage", data, data.length);
    var len = data.length;

    if (len) {
      for (var i = 0; i < len; i++) {
        this.processInput(data[i]);
      }
    } else {
      this.processInput(data);
    }
  }

  function onError(error) {
    this._isReady = false;
    this.emit(BoardEvent.ERROR, error);
    setImmediate(this.disconnect.bind(this));
  }

  function onClose() {
    this._isReady = false;
    this._transport.removeAllListeners();
    delete this._transport;
    this.emit(BoardEvent.DISCONNECT);
  }

  function cleanup() {
    this.disconnect(function () {
      if (typeof exports !== 'undefined') {
        process.exit();
      }
    });
  }

  function attachCleanup(self) {
    if (typeof exports === 'undefined') {
      window.addEventListener('beforeunload', self._cleanupHandler);
    } else {
      process.addListener('SIGINT', self._cleanupHandler);
      process.addListener('uncaughtException', self._cleanupHandler);
    }
  }

  function unattachCleanup(self) {
    if (typeof exports === 'undefined') {
      window.removeEventListener('beforeunload', self._cleanupHandler);
    } else {
      process.removeListener('SIGINT', self._cleanupHandler);
      process.removeListener('uncaughtException', self._cleanupHandler);
    }
  }

  function debug(msg) {
    console && console.log(msg.stack || msg);
  }

  Board.prototype = proto = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Board
    },

    samplingInterval: {
      get: function () {
        return this._samplingInterval;
      },
      set: function (interval) {
        if (interval >= Board.MIN_SAMPLING_INTERVAL && interval <= Board.MAX_SAMPLING_INTERVAL) {
          this._samplingInterval = interval;
          this.send([
            START_SYSEX,
            SAMPLING_INTERVAL,
            interval & 0x007F, (interval >> 7) & 0x007F,
            END_SYSEX
          ]);
        } else {
          throw new Error('warning: Sampling interval must be between ' + Board.MIN_SAMPLING_INTERVAL +
            ' and ' + Board.MAX_SAMPLING_INTERVAL);
        }
      }
    },

    isReady: {
      get: function () {
        return this._isReady;
      }
    },

    isConnected: {
      get: function () {
        return this._transport && this._transport.isOpen;
      }
    }

  });

  proto.begin = function () {
    this.once(BoardEvent.FIRMWARE_NAME, this._initialVersionResultHandler);
    this.reportFirmware();
  };

  proto.processInput = function (inputData) {
    var len, cmd;

    this._buf.push(inputData);
    len = this._buf.length;
    cmd = this._buf[0];

    if (cmd >= 128 && cmd !== START_SYSEX) {
      if (cmd == 0xFF) {
        //Reset SYSEX
        this._buf = [];
      }
      //Report Digital
      else if ((cmd & 0xF0) == 0xD0 && len == 2) {
        this._buf = [];
      } else if (len == 3) {
        this.processMultiByteCommand(this._buf);
        this._buf = [];
      }
    } else if (cmd === START_SYSEX && inputData === END_SYSEX) {
      this.processSysexCommand(this._buf);
      this._buf = [];
    } else if (inputData >= 128 && cmd < 128) {
      this._buf = [];
      if (inputData !== END_SYSEX) {
        this._buf.push(inputData);
      }
    }
  };

  proto.processMultiByteCommand = function (commandData) {
    console.log("processMultiByteCommand", commandData);
    var command = commandData[0],
      channel;

    if (command < 0xF0) {
      command = command & 0xF0;
      channel = commandData[0] & 0x0F;
    }

    console.log("Command:", command);

    switch (command) {
      case SET_PIN_MODE:
        console.log("SET_PIN_MODE:", command, commandData);
        var pinNum = commandData[1];
        var pinMode = commandData[2];
        var pin = this._ioPins[pinNum];
        if (pin === undefined) {
          return;
        }
        switch (pinMode) {
          case Pin.DOUT:
            pin.setMode(Pin.DOUT);
            pin.value = 0;
            this.emit(BoardEvent.DIGITAL_DATA, {
              pin: pin
            });
            break;
          case Pin.DIN:
            pin.setMode(Pin.DIN);
            pin.value = 0;
            this.emit(BoardEvent.DIGITAL_DATA, {
              pin: pin
            });
            break;
        }
        break;
      case DIGITAL_MESSAGE:
        console.log("DIGITAL_MESSAGE:", command);
        this.processDigitalMessage(channel, commandData[1], commandData[2]);
        break;
      case REPORT_VERSION:
        console.log("REPORT_VERSION:", command);
        this._firmwareVersion = commandData[1] + commandData[2] / 10;
        this.emit(BoardEvent.FIRMWARE_VERSION, {
          version: this._firmwareVersion
        });
        break;
      case ANALOG_MESSAGE:
        console.log("ANALOG_MESSAGE:", command);
        this.processAnalogMessage(channel, commandData[1], commandData[2]);
        break;
    }
  };

  proto.processDigitalMessage = function (port, bits0_6, bits7_13) {
    var offset = port * 8,
      lastPin = offset + 8,
      portVal = bits0_6 | (bits7_13 << 7),
      pinVal,
      pin = {};
    if (lastPin >= this._totalPins) {
      lastPin = this._totalPins;
    }

    var j = 0;
    for (var i = offset; i < lastPin; i++) {
      pin = this.getDigitalPin(i);

      if (pin === undefined) {
        return;
      }

      if (pin.type === Pin.DOUT) {
        pinVal = (portVal >> j) & 0x01;
        if (pinVal !== pin.value) {
          pin.value = pinVal;

          this.emit(BoardEvent.DIGITAL_DATA, {
            pin: pin
          });
        }
      }
      j++;
    }
  };

  proto.processAnalogMessage = function (channel, bits0_6, bits7_13) {

    var analogPin = this.getDigitalPin(channel);

    if (analogPin === undefined) {
      return;
    }
    analogPin.value = this.getValueFromTwo7bitBytes(bits0_6, bits7_13) / analogPin.analogWriteResolution;
    this.emit(BoardEvent.ANALOG_DATA, {
      pin: analogPin
    });
  };

  proto.processSysexCommand = function (sysexData) {
    sysexData.shift();
    sysexData.pop();

    var command = sysexData[0];
    switch (command) {
      case REPORT_FIRMWARE:
        this.processQueryFirmwareResult(sysexData);
        break;
      case STRING_DATA:
        this.processSysExString(sysexData);
        break;
      case CAPABILITY_RESPONSE:
        this.processCapabilitiesResponse(sysexData);
        break;
      case PIN_STATE_RESPONSE:
        this.processPinStateResponse(sysexData);
        break;
      case ANALOG_MAPPING_RESPONSE:
        this.processAnalogMappingResponse(sysexData);
        break;
      default:
        this.emit(BoardEvent.SYSEX_MESSAGE, {
          message: sysexData
        });
        break;
    }
  };

  proto.processQueryFirmwareResult = function (msg) {
    var data;

    for (var i = 3, len = msg.length; i < len; i += 2) {
      data = msg[i];
      data += msg[i + 1];
      this._firmwareName += String.fromCharCode(data);
    }
    this._firmwareVersion = msg[1] + msg[2] / 10;
    this.emit(BoardEvent.FIRMWARE_NAME, {
      name: this._firmwareName,
      version: this._firmwareVersion
    });
  };

  proto.processSysExString = function (msg) {
    var str = '',
      data,
      len = msg.length;

    for (var i = 1; i < len; i += 2) {
      data = msg[i];
      data += msg[i + 1];
      str += String.fromCharCode(data);
    }
    this.emit(BoardEvent.STRING_MESSAGE, {
      message: str
    });
  };

  proto.processCapabilitiesResponse = function (msg) {
    var pinCapabilities = {},
      byteCounter = 1,
      pinCounter = 0,
      analogPinCounter = 0,
      len = msg.length,
      type,
      pin;

    this._capabilityQueryResponseReceived = true;

    while (byteCounter <= len) {
      if (msg[byteCounter] === 127) {

        this._digitalPinMapping[pinCounter] = pinCounter;
        type = undefined;

        if (pinCapabilities[Pin.DOUT]) {
          type = Pin.DOUT;
        }

        if (pinCapabilities[Pin.AIN]) {
          type = Pin.AIN;
          this._analogPinMapping[analogPinCounter++] = pinCounter;
        }

        pin = new Pin(this, pinCounter, type);
        pin.setCapabilities(pinCapabilities);
        this._ioPins[pinCounter] = pin;

        if (pin._capabilities[Pin.I2C]) {
          this._i2cPins.push(pin.number);
        }

        pinCapabilities = {};
        pinCounter++;
        byteCounter++;
      } else {
        pinCapabilities[msg[byteCounter]] = msg[byteCounter + 1];
        byteCounter += 2;
      }
    }

    this._numPorts = Math.ceil(pinCounter / 8);

    for (var j = 0; j < this._numPorts; j++) {
      this._digitalPort[j] = 0;
    }

    this._totalPins = pinCounter;
    this._totalAnalogPins = analogPinCounter;
    this.queryAnalogMapping();
  };

  proto.processAnalogMappingResponse = function (msg) {
    var len = msg.length;

    for (var i = 1; i < len; i++) {
      if (msg[i] !== 127) {
        this._analogPinMapping[msg[i]] = i - 1;
        this.getPin(i - 1).setAnalogNumber(msg[i]);
      }
    }
  };

  proto.startup = function () {
    this._isReady = true;
    this.emit(BoardEvent.READY, this);
    this.enableDigitalPins();
  };

  proto.systemReset = function () {
    this.send([SYSEX_RESET]);
  };

  proto.processPinStateResponse = function (msg) {
    if (this._numPinStateRequests <= 0) {
      return;
    }

    var len = msg.length,
      pinNum = msg[1],
      pinType = msg[2],
      pinState,
      pin = this._ioPins[pinNum];

    if (len > 4) {
      pinState = this.getValueFromTwo7bitBytes(msg[3], msg[4]);
    } else if (len > 3) {
      pinState = msg[3];
    }

    if (pin.type !== pinType) {
      pin.setMode(pinType, true);
    }

    pin.state = pinState;

    this._numPinStateRequests--;
    if (this._numPinStateRequests < 0) {
      this._numPinStateRequests = 0;
    }

    this._pinStateEventCenter.emit(pinNum, pin);

    this.emit(BoardEvent.PIN_STATE_RESPONSE, {
      pin: pin
    });
  };

  proto.toDec = function (ch) {
    ch = ch.substring(0, 1);
    var decVal = ch.charCodeAt(0);
    return decVal;
  };

  proto.sendAnalogData = function (pin, value) {
    var pwmResolution = this.getDigitalPin(pin).analogWriteResolution;

    value *= pwmResolution;
    value = (value < 0) ? 0 : value;
    value = (value > pwmResolution) ? pwmResolution : value;

    if (pin > 15 || value > Math.pow(2, 14)) {
      this.sendExtendedAnalogData(pin, value);
    } else {
      this.send([ANALOG_MESSAGE | (pin & 0x0F), value & 0x007F, (value >> 7) & 0x007F]);
    }
  };

  proto.sendExtendedAnalogData = function (pin, value) {
    var analogData = [];

    // If > 16 bits
    if (value > Math.pow(2, 16)) {
      throw new Error('Extended Analog values > 16 bits are not currently supported by StandardFirmata');
    }

    analogData[0] = START_SYSEX;
    analogData[1] = EXTENDED_ANALOG;
    analogData[2] = pin;
    analogData[3] = value & 0x007F;
    analogData[4] = (value >> 7) & 0x007F; // Up to 14 bits

    // If > 14 bits
    if (value >= Math.pow(2, 14)) {
      analogData[5] = (value >> 14) & 0x007F;
    }

    analogData.push(END_SYSEX);
    this.send(analogData);
  };

  proto.sendDigitalData = function (pin, value) {
    var portNum = Math.floor(pin / 8);
    if (value > 0 && value < 1) {
      value = value >= 0.5 ? 1 : 0;
    }
    if (value === Pin.HIGH) {
      // Set the bit
      this._digitalPort[portNum] |= (value << (pin % 8));
    } else if (value === Pin.LOW) {
      // Clear the bit
      this._digitalPort[portNum] &= ~(1 << (pin % 8));
    } else {
      // Should not happen...
      throw new Error('Invalid value passed to sendDigital, value must be 0 or 1.');
    }

    this.sendDigitalPort(portNum, this._digitalPort[portNum]);
  };

  proto.sendServoData = function (pin, value) {
    var servoPin = this.getDigitalPin(pin);

    if (servoPin.type === Pin.SERVO && servoPin.lastValue !== value) {
      this.sendAnalogData(pin, value);
    }
  };

  proto.queryCapabilities = function () {
    this.send([START_SYSEX, CAPABILITY_QUERY, END_SYSEX]);
  };

  proto.queryAnalogMapping = function () {
    this.send([START_SYSEX, ANALOG_MAPPING_QUERY, END_SYSEX]);
  };

  proto.getValueFromTwo7bitBytes = function (lsb, msb) {
    return (msb << 7) | lsb;
  };

  proto.getTransport = function () {
    return this._transport;
  };

  proto._setTransport = function (trsp) {
    var klass = trsp;

    if (typeof trsp === 'string') {
      klass = scope.transport[trsp];
    }

    if (klass && (trsp = new klass(this._options))) {
      trsp.on(TransportEvent.OPEN, this._openHandler);
      trsp.on(TransportEvent.MESSAGE, this._messageHandler);
      trsp.on(TransportEvent.ERROR, this._errorHandler);
      trsp.on(TransportEvent.CLOSE, this._closeHandler);
      this._transport = trsp;
    }
  };

  proto.reportVersion = function () {
    this.send(REPORT_VERSION);
  };

  proto.reportFirmware = function () {
    this.send([START_SYSEX, REPORT_FIRMWARE, END_SYSEX]);
  };

  proto.enableDigitalPins = function () {
    for (var i = 0; i < this._numPorts; i++) {
      this.sendDigitalPortReporting(i, Pin.ON);
    }
  };

  proto.disableDigitalPins = function () {
    for (var i = 0; i < this._numPorts; i++) {
      this.sendDigitalPortReporting(i, Pin.OFF);
    }
  };

  proto.sendDigitalPortReporting = function (port, mode) {
    this.send([(REPORT_DIGITAL | port), mode]);
  };

  proto.enableAnalogPin = function (pinNum) {
    this.sendAnalogPinReporting(pinNum, Pin.ON);
    this.getAnalogPin(pinNum)._analogReporting = true;
  };

  proto.disableAnalogPin = function (pinNum) {
    this.sendAnalogPinReporting(pinNum, Pin.OFF);
    this.getAnalogPin(pinNum)._analogReporting = false;
  };

  proto.sendAnalogPinReporting = function (pinNum, mode) {
    this.send([REPORT_ANALOG | pinNum, mode]);
  };

  proto.setDigitalPinMode = function (pinNum, mode, silent) {
    this.getDigitalPin(pinNum).setMode(mode, silent);
  };

  proto.setAnalogPinMode = function (pinNum, mode, silent) {
    this.getAnalogPin(pinNum).setMode(mode, silent);
  };

  proto.setPinMode = function (pinNum, mode) {
    this.send([SET_PIN_MODE, pinNum, mode]);
  };

  proto.enablePullUp = function (pinNum) {
    this.sendDigitalData(pinNum, Pin.HIGH);
  };

  proto.getFirmwareName = function () {
    return this._firmwareName;
  };

  proto.getFirmwareVersion = function () {
    return this._firmwareVersion;
  };

  proto.getPinCapabilities = function () {
    var capabilities = [],
      len,
      pinElements,
      pinCapabilities,
      hasCapabilities;

    var modeNames = {
      0: 'input',
      1: 'output',
      2: 'analog',
      3: 'pwm',
      4: 'servo',
      5: 'shift',
      6: 'i2c',
      7: 'onewire',
      8: 'stepper'
    };

    len = this._ioPins.length;
    for (var i = 0; i < len; i++) {
      pinElements = {};
      pinCapabilities = this._ioPins[i]._capabilities;
      hasCapabilities = false;

      for (var mode in pinCapabilities) {
        if (pinCapabilities.hasOwnProperty(mode)) {
          hasCapabilities = true;
          if (mode >= 0) {
            pinElements[modeNames[mode]] = this._ioPins[i]._capabilities[mode];
          }
        }
      }

      if (!hasCapabilities) {
        capabilities[i] = {
          'not available': '0'
        };
      } else {
        capabilities[i] = pinElements;
      }
    }

    return capabilities;
  };

  proto.queryPinState = function (pins, callback) {
    var self = this,
      promises = [],
      cmds = [],
      done;

    done = self._pinStateEventCenter.once.bind(self._pinStateEventCenter);
    pins = util.isArray(pins) ? pins : [pins];
    pins = pins.map(function (pin) {
      return pin instanceof Pin ? pin : self.getPin(pin)
    });

    pins.forEach(function (pin) {
      promises.push(util.promisify(done, function (pin) {
        this.resolve(pin);
      })(pin.number));
      push.apply(cmds, [START_SYSEX, PIN_STATE_QUERY, pin.number, END_SYSEX]);
      self._numPinStateRequests++;
    });

    self.send(cmds);

    if (typeof callback === 'function') {
      Promise.all(promises).then(function (pins) {
        callback.call(self, pins.length > 1 ? pins : pins[0]);
      });
    } else {
      return pins.length > 1 ? promises : promises[0];
    }
  };

  proto.sendDigitalPort = function (portNumber, portData) {
    this.send([DIGITAL_MESSAGE | (portNumber & 0x0F), portData & 0x7F, portData >> 7]);
  };

  proto.sendString = function (str) {
    var decValues = [];
    for (var i = 0, len = str.length; i < len; i++) {
      decValues.push(this.toDec(str[i]) & 0x007F);
      decValues.push((this.toDec(str[i]) >> 7) & 0x007F);
    }
    this.sendSysex(STRING_DATA, decValues);
  };

  proto.sendSysex = function (command, data) {
    var sysexData = [];
    sysexData[0] = START_SYSEX;
    sysexData[1] = command;
    for (var i = 0, len = data.length; i < len; i++) {
      sysexData.push(data[i]);
    }
    sysexData.push(END_SYSEX);
    this.send(sysexData);
  };

  proto.sendServoAttach = function (pin, minPulse, maxPulse) {
    var servoPin,
      servoData = [];

    minPulse = minPulse || 544; // Default value = 544
    maxPulse = maxPulse || 2400; // Default value = 2400

    servoData[0] = START_SYSEX;
    servoData[1] = SERVO_CONFIG;
    servoData[2] = pin;
    servoData[3] = minPulse % 128;
    servoData[4] = minPulse >> 7;
    servoData[5] = maxPulse % 128;
    servoData[6] = maxPulse >> 7;
    servoData[7] = END_SYSEX;

    this.send(servoData);

    servoPin = this.getDigitalPin(pin);
    servoPin.setMode(Pin.SERVO, true);
  };

  proto.getPin = function (pinNum) {
    return this._ioPins[pinNum];
  };

  proto.getAnalogPin = function (pinNum) {
    return this._ioPins[this._analogPinMapping[pinNum]];
  };

  proto.getDigitalPin = function (pinNum) {
    return this._ioPins[this._digitalPinMapping[pinNum]];
  };

  proto.getPins = function () {
    return this._ioPins;
  };

  proto.analogToDigital = function (analogPinNum) {
    return this.getAnalogPin(analogPinNum).number;
  };

  proto.getPinCount = function () {
    return this._totalPins;
  };

  proto.getAnalogPinCount = function () {
    return this._totalAnalogPins;
  };

  proto.getI2cPins = function () {
    return this._i2cPins;
  };

  proto.reportCapabilities = function () {
    var capabilities = this.getPinCapabilities(),
      len = capabilities.length,
      resolution;

    for (var i = 0; i < len; i++) {
      debug('Pin ' + i + ':');
      for (var mode in capabilities[i]) {
        if (capabilities[i].hasOwnProperty(mode)) {
          resolution = capabilities[i][mode];
          debug('\t' + mode + ' (' + resolution + (resolution > 1 ? ' bits)' : ' bit)'));
        }
      }
    }
  };

  proto.send = function (data) {
    this.isConnected && this._transport.send(data);
  };

  proto.close = function (callback) {
    this.disconnect(callback);
  };

  proto.flush = function () {
    this.isConnected && this._transport.flush();
  };

  proto.disconnect = function (callback) {
    callback = callback || function () {};
    if (this.isConnected) {
      this.emit(BoardEvent.BEFOREDISCONNECT);
    }
    this._isReady = false;
    unattachCleanup(this);
    if (this._transport) {
      if (this._transport.isOpen) {
        this.once(BoardEvent.DISCONNECT, callback);
        this._transport.close();
      } else {
        this._transport.removeAllListeners();
        delete this._transport;
        callback();
      }
    } else {
      callback();
    }
  };

  Board.MIN_SAMPLING_INTERVAL = 20;

  Board.MAX_SAMPLING_INTERVAL = 15000;

  scope.BoardEvent = BoardEvent;

  scope.Board = Board;
  scope.board = scope.board || {};
}));