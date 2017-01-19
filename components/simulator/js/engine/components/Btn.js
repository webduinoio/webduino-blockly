(function (scope) {
  'use strict';

  var uiCallback;

  function Btn(board, name, vcc, gnd, din, cs, clk) {
    this._name = name;
    this._vcc = vcc;
    this._gnd = gnd;
    this._board = board;
    this._din = din;
    this._cs = cs;
    this._clk = clk;
    var self = this;
    board.on(webduino.BoardEvent.ANALOG_DATA, function (data) {
      //console.log("ANALOG_DATA", data);
      action(self, data.pin);
    });
    board.on(webduino.BoardEvent.DIGITAL_DATA, function (data) {
      //console.log("DIGITAL_DATA", data);
      action(self, data.pin);
    });
    board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (data) {
      data = data.message;
      if (data[0] == 4 /*Webduino CMD*/ && data[1] == 8 /*Matrix CMD*/ ) {
        action(self, data);
      }
    });
  }

  function action(btn, data) {
    var jsonData = {
      action: {
        id: btn._board._options.device,
        type: btn._board.constructor.name,
        connector: [{
          name: btn._name,
          type: "Btn",
          data: hexData
        }]
      }
    };
    uiCallback(jsonData);
  }

  Btn.prototype = Object.create(Btn.prototype, {
    constructor: { value: Btn }
  });

  Btn.prototype.action = function (callback) {
    uiCallback = callback;
  }

  scope.Btn = Btn;
})(Engine);