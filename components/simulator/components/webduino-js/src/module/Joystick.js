+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module;
  var BoardEvent = scope.BoardEvent;
  var PinEvent = scope.PinEvent;
  var Pin = scope.Pin;
  var Button = scope.module.Button;
  var ButtonEvent = scope.module.ButtonEvent;
  var proto;

  var JoystickEvent = {
    MESSAGE: 'message'
  };

  function Joystick(board, analogPinX, analogPinY, pinZ) {
    Module.call(this);
    this._board = board;
    this._pinX = Number(analogPinX);
    this._pinY = Number(analogPinY);
    this._pinZ = pinZ;
    this._data = {
      x: 0,
      y: 0,
      z: 0
    };

    board.enableAnalogPin(this._pinX);
    board.enableAnalogPin(this._pinY);
    board.addListener(BoardEvent.ANALOG_DATA, onMessage.bind(this));

    this._button = new Button(board, pinZ);
    this._button.on(ButtonEvent.PRESS, onPinChange.bind(this));
    this._button.on(ButtonEvent.RELEASE, onPinChange.bind(this));
  }

  function onMessage(event) {
    var pin = event.pin;

    if (pin.analogNumber !== this._pinX && pin.analogNumber !== this._pinY) {
      return false;
    } 

    if (pin.analogNumber === this._pinX) {
      this._data.x = pin.value;
    }

    if (pin.analogNumber === this._pinY) {
      this._data.y = pin.value;
    }

    this.emit(JoystickEvent.MESSAGE, this._data.x, this._data.y, this._data.z);
  }

  function onPinChange(pin) {
    this._data.z = this._button._pin.value;
  }

  Joystick.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Joystick
    }
  });

  scope.module.JoystickEvent = JoystickEvent;
  scope.module.Joystick = Joystick;
}));
