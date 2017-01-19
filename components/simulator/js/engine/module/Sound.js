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

  var SoundEvent = {
    DETECTED: 'detected',
    ENDED: 'ended'
  };

  function Sound(board, pin) {
    Module.call(this);

    this._type = 'FC_04';
    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.LOW) {
      this.emit(SoundEvent.DETECTED);
    } else {
      this.emit(SoundEvent.ENDED);
    }
  }

  Sound.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Sound
    }
  });

  scope.module.SoundEvent = SoundEvent;
  scope.module.Sound = Sound;
}));
