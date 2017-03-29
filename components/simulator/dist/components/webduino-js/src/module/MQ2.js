+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    proto;

  var MQ2Event = {
    MESSAGE: 'message',
    DETECTED: 'detected',
    ENDED: 'ended'
  };

  function MQ2(board, analogPinNumber, pin) {
    Module.call(this);
    this._board = board;

    if (analogPinNumber) {
      this._pinNumber = Number(analogPinNumber);
      this._messageHandler = onMessage.bind(this);
    }

    if (pin) {
      this._pin = pin;
      board.setDigitalPinMode(pin.number, Pin.DIN);
      this._pin.value = Pin.LOW;
      this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
    }
  }

  function onMessage(event) {
    var pin = event.pin;
    if (this._pinNumber !== pin.analogNumber) {
      return false;
    }

    this.emit(MQ2Event.MESSAGE, pin.value);
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(MQ2Event.DETECTED);
    } else {
      this.emit(MQ2Event.ENDED);
    }
  }

  MQ2.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: MQ2
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._state = 'on';
    this._board.enableAnalogPin(this._pinNumber);
    this._analogCallback = function(val) {
      callback(val);
    };
    this._board.on(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.addListener(MQ2Event.MESSAGE, this._analogCallback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.disableAnalogPin(this._pinNumber);
    this._board.removeListener(BoardEvent.ANALOG_DATA, this._messageHandler);
    if (this._analogCallback) {
      this.removeListener(MQ2Event.MESSAGE, this._analogCallback);
      this._analogCallback = null;
    }
  };

  proto.onEvent = function(type, handler) {
    this.addListener(type, handler);
  };

  proto.offEvent = function(type, handler) {
    this.removeListener(type, handler);
  };

  scope.module.MQ2 = MQ2;
}));
