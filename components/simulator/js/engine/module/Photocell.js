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
    proto;

  var PhotocellEvent = {
    MESSAGE: 'message'
  };

  function Photocell(board, analogPinNumber) {
    Module.call(this);
    this._board = board;
    this._pinNumber = Number(analogPinNumber);
    this._messageHandler = onMessage.bind(this);
  }

  function onMessage(event) {
    var pin = event.pin;
    if (this._pinNumber !== pin.analogNumber) {
      return false;
    }

    this.emit(PhotocellEvent.MESSAGE, pin.value);
  }

  Photocell.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Photocell
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
    var _this = this;

    this._board.enableAnalogPin(this._pinNumber);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(val) {
      callback(val);
    };

    this._state = 'on';
    this._board.on(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.addListener(PhotocellEvent.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.disableAnalogPin(this._pinNumber);
    this._board.removeListener(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.removeListener(PhotocellEvent.MESSAGE, this._callback);
    this._callback = null;
  };

  scope.module.Photocell = Photocell;
}));
