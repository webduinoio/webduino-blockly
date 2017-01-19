(function (scope) {
  'use strict';

  var uiCallback;

  function Matrix(board, name, vcc, gnd, din, cs, clk) {
    this._name = name;
    this._vcc = vcc;
    this._gnd = gnd;
    this._board = board;
    this._din = din;
    this._cs = cs;
    this._clk = clk;
    var self = this;

    board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (data) {
      data = data.message;
      if (data[0] == 4 /*Webduino CMD*/ && data[1] == 8 /*Matrix CMD*/ ) {
        action(self, data);
      }
    });


  }

  function action(matrix, data) {
    //console.log("matrix data:", data);
    var matrixCMD = data[2];
    var hexData = "";
    if (matrixCMD <= 0 || matrixCMD > 4) {
      return;
    }
    switch (matrixCMD) {
      case 0: //create
        hexData = "0000000000000000";
        break;
      case 1:
        for (var i = 3; i < data.length; i++) {
          hexData += String.fromCharCode(data[i]);
        }
        break;
    }

    var jsonData = {
      action: {
        id: matrix._board._options.device,
        type: matrix._board.constructor.name,
        connector: [{
          name: matrix._name,
          type: "Matrix",
          data: hexData
        }]
      }
    };
    uiCallback(jsonData);
  }


  Matrix.prototype = Object.create(Matrix.prototype, {
    constructor: { value: Matrix }
  });

  Matrix.prototype.action = function (callback) {
    uiCallback = callback;
  }

  scope.Matrix = Matrix;
})(Engine);