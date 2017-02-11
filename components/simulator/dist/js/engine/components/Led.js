(function (scope) {
  'use strict';

  var uiCallback;

  function Led(board, name, signal, gnd) {
    this._name = name;
    this._gnd = gnd;
    this._board = board;
    this._signal = signal;
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

  function action(led, pin) {
    if (pin._number != led._signal) {
      return;
    }
    var jsonData = {
      action: {
        id: led._board._options.device,
        type: led._board.constructor.name,
        connector: [{
          name: led._name,
          type: "Led",
          intensity: pin._value
        }]
      }
    };
    uiCallback(jsonData);
  }


  Led.prototype = Object.create(Led.prototype, {
    constructor: { value: Led }
  });

  Led.prototype.action = function (callback) {
    uiCallback = callback;
  }

  scope.Led = Led;
})(Engine);