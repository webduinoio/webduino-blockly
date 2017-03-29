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

  var PirEvent = {
    DETECTED: 'detected',
    ENDED: 'ended'
  };

  function Pir(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(PirEvent.DETECTED);
    } else {
      this.emit(PirEvent.ENDED);
    }
  }

  Pir.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Pir
    }
  });

  scope.module.PirEvent = PirEvent;
  scope.module.Pir = Pir;
}));
