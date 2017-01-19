+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module,
    proto;

  function Relay(board, pin) {
    Module.call(this);

    this._type = 'KY-019';
    this._board = board;
    this._pin = pin;

    this._onValue = 1;
    this._offValue = 0;

    board.setDigitalPinMode(pin.number, Pin.DOUT);

    this.off();
  }

  function checkPinState(self, pin, state, callback) {
    self._board.queryPinState(pin, function (pin) {
      if (pin.state === state) {
        callback.call(self);
      }
    });
  }

  Relay.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Relay
    }
  });

  proto.on = function (callback) {
    this._pin.value = this._onValue;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  proto.off = function (callback) {
    this._pin.value = this._offValue;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  proto.toggle = function (callback) {
    this._pin.value = 1 - this._pin.value;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  scope.module.Relay = Relay;
}));
