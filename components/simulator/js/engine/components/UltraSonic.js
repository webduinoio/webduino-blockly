(function (scope) {
  'use strict';

  var uiCallback;

  function UltraSonic(board, name, vcc, trig, echo, gnd) {
    this._board = board;
    this._name = name;
    this._vcc = gnd;
    this._gnd = gnd;
    this._trig = trig;
    this._echo = echo;
    var self = this;

    board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (data) {
      data = data.message;
      // data[1]: Trigger , data[2]: Echo
      if (data[0] == 1 /*UltraSonic*/ ) {
        //action(self, data);
      }
    });
  }

  function action(ultraSonic, data) {
    if (ultraSonic._trig != data[1] || ultraSonic._echo != data[2]) {
      return;
    }
    var jsonData = {
      action: {
        id: ultraSonic._board._options.device,
        type: ultraSonic._board.constructor.name,
        connector: [{
          name: ultraSonic._name,
          type: "UltraSonic",
          distance: 99
        }]
      }
    };
    uiCallback(jsonData);
  }

  UltraSonic.prototype = Object.create(UltraSonic.prototype, {
    constructor: { value: UltraSonic }
  });

  UltraSonic.prototype.action = function (callback) {
    uiCallback = callback;
  }

  scope.UltraSonic = UltraSonic;
})(Engine);