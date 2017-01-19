(function (scope) {
  'use strict';

  var uiCallback;

  function RGBLed(board, name, vcc, signalRed, signalGreen, signalBlue) {
    this._name = name;
    this._board = board;
    this._vcc = vcc;
    this._signalRed = signalRed;
    this._signalGreen = signalGreen;
    this._signalBlue = signalBlue;
    var self = this;

    board.on(webduino.BoardEvent.ANALOG_DATA, function (data) {
      //console.log("ANALOG_DATA", data);
      action(self, data.pin);
    });
    board.on(webduino.BoardEvent.DIGITAL_DATA, function (data) {
      //console.log("DIGITAL_DATA", data);
      action(self, data.pin);
    });
  }

  function action(rgbLed, pin) {
    var color = undefined;
    if (pin._number == rgbLed._signalRed) {
      color = "red";
    } else if (pin._number == rgbLed._signalGreen) {
      color = "green";
    } else if (pin._number == rgbLed._signalBlue) {
      color = "blue";
    } else {
      return;
    }

    var jsonData = {
      action: {
        id: rgbLed._board._options.device,
        type: rgbLed._board.constructor.name,
        connector: [{
          name: rgbLed._name,
          type: "RGBLed",
          color: color,
          intensity: pin._value
        }]
      }
    };
    uiCallback(jsonData);
  }


  RGBLed.prototype = Object.create(RGBLed.prototype, {
    constructor: { value: RGBLed }
  });

  RGBLed.prototype.action = function (callback) {
    uiCallback = callback;
  }

  scope.RGBLed = RGBLed;
})(Engine);