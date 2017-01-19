(function (scope) {
  'use strict';

  var uiCallback;

  function Servo(board, name, signal, gnd) {
    window.b = board;
    this._name = name;
    this._gnd = gnd;
    this._board = board;
    this._signal = signal;
    var self = this;
    board.on(webduino.BoardEvent.ANALOG_DATA, function (data) {
      action(self, data.pin);
    });

  }

  function action(servo, pin) {
    if (pin._number != servo._signal) {
      return;
    }
    var jsonData = {
      action: {
        id: servo._board._options.device,
        type: servo._board.constructor.name,
        connector: [{
          name: servo._name,
          type: "Servo",
          intensity: pin._value
        }]
      }
    };
    uiCallback(jsonData);
  }


  Servo.prototype = Object.create(Servo.prototype, {
    constructor: { value: Servo }
  });

  Servo.prototype.action = function (callback) {
    uiCallback = callback;
  }

  Servo.prototype.angle = function (_angle) {
    console.log("angle", _angle);
  }

  scope.Servo = Servo;
})(Engine);