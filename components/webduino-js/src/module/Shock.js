+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    Module = scope.Module;

  var ShockEvent = {
    HIGH: 'high',
    LOW: 'low'
  };

  function Shock(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(ShockEvent.HIGH);
    } else {
      this.emit(ShockEvent.LOW);
    }
  }

  Shock.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Shock
    }
  });

  scope.module.ShockEvent = ShockEvent;
  scope.module.Shock = Shock;
}));
