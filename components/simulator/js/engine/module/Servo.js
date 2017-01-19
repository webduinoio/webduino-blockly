+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module;

  function Servo(board, pin, minAngle, maxAngle) {
    Module.call(this);

    this._type = 'SG90';
    this._board = board;
    this._pin = pin;
    this._angle = undefined;
    this._minAngle = minAngle || 0;
    this._maxAngle = maxAngle || 180;

    board.sendServoAttach(pin.number);
    board.setDigitalPinMode(pin.number, Pin.SERVO);
  }

  Servo.prototype = Object.create(Module.prototype, {

    constructor: {
      value: Servo
    },

    angle: {
      get: function () {
        if (this._pin._type === Pin.SERVO) {
          return this._angle;
        }
      },
      set: function (val) {
        if (this._pin._type === Pin.SERVO) {
          this._angle = val;
          this._pin.value = Math.max(0, Math.min(1, (this._angle - this._minAngle) /
            (this._maxAngle - this._minAngle) * Servo.COEF_TO_0_180));

        }
      }
    }

  });

  Servo.COEF_TO_0_180 = 180 / 255;

  scope.module.Servo = Servo;
}));
