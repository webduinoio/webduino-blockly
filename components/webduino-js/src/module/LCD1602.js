+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var self;
  var proto;
  var sendLength = 50;
  var sendArray = [];
  var sending = false;
  var sendAck = '';
  var sendCallback;
  var Module = scope.Module;
  var _backlight;

  function LCD1602(board) {
    Module.call(this);
    this._board = board;
    self = this;
    board.send([0xF0, 0x04, 0x18, 0x0 /*init*/ , 0xF7]);
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        var m = event.message;
        sending = false;
      });
    startQueue(board);
  }

  LCD1602.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: LCD1602
    },
    backlight: {
      get: function () {
        return _backlight;
      },
      set: function (val) {
        _backlight = val;
      }
    }
  });

  proto.print = function (txt) {
    var cmd = [0xF0, 0x04, 0x18, 0x02];
    cmd = cmd.concat(toASCII(txt));
    cmd.push(0xF7);
    this._board.send(cmd);
  }

  proto.cursor = function (col, row) {
    this._board.send([0xF0, 0x04, 0x18, 0x01, col, row, 0xF7]);
  }

  proto.clear = function () {
    this._board.send([0xF0, 0x04, 0x18, 0x03, 0xF7]);
  }

  function toASCII(str) {
    var data = [];
    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i).toString(16);
      if (charCode.length == 1) {
        charCode = '0' + charCode;
      }
      var highChar = charCode.charAt(0);
      var lowChar = charCode.charAt(1);
      data.push(highChar.charCodeAt(0));
      data.push(lowChar.charCodeAt(0));
    }
    return data;
  }

  function startQueue(board) {
    setInterval(function () {
      if (sending || sendArray.length == 0) {
        return;
      }
      sending = true;
      var sendObj = sendArray.shift();
      sendAck = sendObj.ack;
      if (sendAck > 0) {
        board.send(sendObj.obj);
      } else {
        sending = false;
        sendCallback();
      }
    }, 0);
  }

  scope.module.LCD1602 = LCD1602;
}));