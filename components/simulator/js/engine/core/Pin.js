+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var EventEmitter = scope.EventEmitter,
    proto;

  var PinEvent = {
    CHANGE: 'change',
    RISING_EDGE: 'risingEdge',
    FALLING_EDGE: 'fallingEdge'
  };

  function Pin(board, number, type) {
    EventEmitter.call(this);

    this._board = board;
    this._type = type;
    this._capabilities = {};
    this._number = number;
    this._analogNumber = undefined;
    this._analogWriteResolution = 255; // default
    this._analogReadResolution = 1023; // default
    this._value = 0;
    this._lastValue = -1;
    this._preFilterValue = 0;
    this._average = 0;
    this._minimum = Math.pow(2, 16);
    this._maximum = 0;
    this._sum = 0;
    this._numSamples = 0;
    this._filters = null;
    this._generator = null;
    this._state = undefined;
    this._analogReporting = false;

    this._sendOutHandler = sendOut.bind(this);
    this._autoSetValueCallback = this.autoSetValue.bind(this);

    managePinListener(this);
  }

  function managePinListener(self) {
    var type = self._type,
      board = self._board;

    if (type === Pin.DOUT || type === Pin.AOUT || type === Pin.SERVO) {
      if (!EventEmitter.listenerCount(self, PinEvent.CHANGE)) {
        self.on(PinEvent.CHANGE, self._sendOutHandler);
      }
    } else {
      if (EventEmitter.listenerCount(self, PinEvent.CHANGE)) {
        try {
          self.removeListener(PinEvent.CHANGE, self._sendOutHandler);
        } catch (e) {
          // Pin had reference to other handler, ignore
          debug("debug: caught self removeEventListener exception");
        }
      }
    }
  }

  function sendOut(self) {
    var type = self._type,
      pinNum = self._number,
      board = self._board,
      value = self.value;

    switch (type) {
      case Pin.DOUT:
        board.sendDigitalData(pinNum, value);
        break;
      case Pin.AOUT:
        board.sendAnalogData(pinNum, value);
        break;
      case Pin.SERVO:
        board.sendServoData(pinNum, value);
        break;
    }
  }

  Pin.prototype = proto = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Pin
    },

    capabilities: {
      get: function () {
        return this._capabilities;
      }
    },

    analogNumber: {
      get: function () {
        return this._analogNumber;
      }
    },

    number: {
      get: function () {
        return this._number;
      }
    },

    analogWriteResolution: {
      get: function () {
        return this._analogWriteResolution;
      }
    },

    analogReadResolution: {
      get: function () {
        return this._analogReadResolution;
      }
    },

    state: {
      get: function () {
        return this._state;
      },
      set: function (val) {
        if (this._type === Pin.PWM) {
          val = val / this._analogWriteResolution;
        }
        this.value = this._value = this._state = val;
      }
    },

    type: {
      get: function () {
        return this._type;
      }
    },

    average: {
      get: function () {
        return this._average;
      }
    },

    minimum: {
      get: function () {
        return this._minimum;
      }
    },

    maximum: {
      get: function () {
        return this._maximum;
      }
    },

    value: {
      get: function () {
        return this._value;
      },
      set: function (val) {
        this._lastValue = this._value;
        this._preFilterValue = val;
        this._value = this.applyFilters(val);
        this.calculateMinMaxAndMean(this._value);
        this.detectChange(this._lastValue, this._value);
      }
    },

    lastValue: {
      get: function () {
        return this._lastValue;
      }
    },

    preFilterValue: {
      get: function () {
        return this._preFilterValue;
      }
    },

    filters: {
      get: function () {
        return this._filters;
      },
      set: function (filters) {
        this._filters = filters;
      }
    },

    generator: {
      get: function () {
        return this._generator;
      }
    }

  });

  proto.setAnalogNumber = function (num) {
    this._analogNumber = num;
  };

  proto.setAnalogWriteResolution = function (value) {
    this._analogWriteResolution = value;
  };

  proto.setAnalogReadResolution = function (value) {
    this._analogReadResolution = value;
  };

  proto.setCapabilities = function (capabilities) {
    this._capabilities = capabilities;
    var analogWriteRes = this._capabilities[Pin.PWM];
    var analogReadRes = this._capabilities[Pin.AIN];
    if (analogWriteRes) {
      this._analogWriteResolution = Math.pow(2, analogWriteRes) - 1;
    }
    if (analogReadRes) {
      this._analogReadResolution = Math.pow(2, analogReadRes) - 1;
    }
  };

  proto.setMode = function (mode, silent) {
    var pinNum = this._number,
      board = this._board;

    if (mode >= 0 && mode < Pin.TOTAL_PIN_MODES) {
      this._type = mode;
      managePinListener(this);

      if (!silent || silent !== true) {
        board.setPinMode(pinNum, mode);
      }
    }
  };

  proto.detectChange = function (oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    this.emit(PinEvent.CHANGE, this);
    if (oldValue <= 0 && newValue !== 0) {
      this.emit(PinEvent.RISING_EDGE, this);
    } else if (oldValue !== 0 && newValue <= 0) {
      this.emit(PinEvent.FALLING_EDGE, this);
    }
  };

  proto.clearWeight = function () {
    this._sum = this._average;
    this._numSamples = 1;
  };

  proto.calculateMinMaxAndMean = function (val) {
    var MAX_SAMPLES = Number.MAX_VALUE;

    this._minimum = Math.min(val, this._minimum);
    this._maximum = Math.max(val, this._maximum);
    this._sum += val;
    this._average = this._sum / (++this._numSamples);
    if (this._numSamples >= MAX_SAMPLES) {
      this.clearWeight();
    }
  };

  proto.clear = function () {
    this._minimum = this._maximum = this._average = this._lastValue = this._preFilterValue;
    this.clearWeight();
  };

  proto.addFilter = function (newFilter) {
    if (newFilter === null) {
      return;
    }
    if (this._filters === null) {
      this._filters = [];
    }
    this._filters.push(newFilter);
  };

  proto.removeFilter = function (filterToRemove) {
    var index;

    if (this._filters.length < 1) {
      return;
    }
    index = this._filters.indexOf(filterToRemove);
    if (index !== -1) {
      this._filters.splice(index, 1);
    }
  };

  proto.addGenerator = function (newGenerator) {
    this.removeGenerator();
    this._generator = newGenerator;
    this._generator.on('update', this._autoSetValueCallback);
  };

  proto.removeGenerator = function () {
    if (this._generator !== null) {
      this._generator.removeListener('update', this._autoSetValueCallback);
    }
    delete this._generator;
  };

  proto.removeAllFilters = function () {
    delete this._filters;
  };

  proto.autoSetValue = function (val) {
    this.value = val;
  };

  proto.applyFilters = function (val) {
    var result;

    if (this._filters === null) {
      return val;
    }
    result = val;
    var len = this._filters.length;
    for (var i = 0; i < len; i++) {
      result = this._filters[i].processSample(result);
    }
    return result;
  };

  proto.read = function () {
    var type = this._type,
      board = this._board,
      self = this;

    switch (type) {
      case Pin.DOUT:
      case Pin.AOUT:
      case Pin.SERVO:
        return board.queryPinState(self._number).then(function (pin) {
          return pin.state;
        });

      case Pin.AIN:
        if (!self._analogReporting) {
          board.enableAnalogPin(self._analogNumber);
        }

      case Pin.DIN:
        return new Promise(function (resolve) {
          setImmediate(function () {
            resolve(self.value);
          });
        });
    }
  };

  proto.write = function (value) {
    var type = this._type;

    if (type === Pin.DOUT || type === Pin.AOUT || type === Pin.SERVO) {
      this.value = value;
    }
  };

  Pin.HIGH = 1;
  Pin.LOW = 0;
  Pin.ON = 1;
  Pin.OFF = 0;
  Pin.DIN = 0x00;
  Pin.DOUT = 0x01;
  Pin.AIN = 0x02;
  Pin.AOUT = 0x03;
  Pin.PWM = 0x03;
  Pin.SERVO = 0x04;
  Pin.SHIFT = 0x05;
  Pin.I2C = 0x06;
  Pin.ONEWIRE = 0x07;
  Pin.STEPPER = 0x08;
  Pin.TOTAL_PIN_MODES = 9;

  scope.PinEvent = PinEvent;
  scope.Pin = Pin;
}));