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
  var _textSize = 2;
  var _cursorX = 0;
  var _cursorY = 0;
  var sendLength = 50;
  var sendArray = [];
  var sending = false;
  var sendAck = '';
  var sendCallback;
  var Module = scope.Module;

  function SSD1306(board) {
    Module.call(this);
    this._board = board;
    self = this;
    board.send([0xF0, 0x04, 0x01, 0x0, 0xF7]);
    board.send([0xF0, 0x04, 0x01, 0x02, _cursorX, _cursorY, 0xF7]);
    board.send([0xF0, 0x04, 0x01, 0x03, _textSize, 0xF7]);
    board.send([0xF0, 0x04, 0x01, 0x01, 0xF7]);
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        var m = event.message;
        sending = false;
      });
    startQueue(board);
  }

  SSD1306.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: SSD1306
    },
    textSize: {
      get: function () {
        return _textSize;
      },
      set: function (val) {
        this._board.send([0xF0, 0x04, 0x01, 0x03, val, 0xF7]);
        _textSize = val;
      }
    },
    cursorX: {
      get: function () {
        return _cursorX;
      },
      set: function (val) {
        _cursorX = val;
      }
    },
    cursorY: {
      get: function () {
        return _cursorY;
      },
      set: function (val) {
        _cursorY = val;
      }
    }
  });

  proto.clear = function () {
    this._board.send([0xF0, 0x04, 0x01, 0x01, 0xF7]);
  }

  proto.drawImage = function (num) {
    this._board.send([0xF0, 0x04, 0x01, 0x05, num, 0xF7]);
  }

  proto.render = function () {
    this._board.send([0xF0, 0x04, 0x01, 0x06, 0xF7]);
  }

  proto.save = function (data, callback) {
    sendCallback = callback;
    for (var i = 0; i < data.length; i = i + sendLength) {
      var chunk = data.substring(i, i + sendLength);
      saveChunk(i / 2, chunk);
    }
    sendArray.push({ 'obj': {}, 'ack': 0 });
  }

  function saveChunk(startPos, data) {
    var CMD = [0xf0, 0x04, 0x01, 0x0A];
    var raw = [];
    raw = raw.concat(CMD);
    var n = '0000' + startPos.toString(16);
    n = n.substring(n.length - 4);
    for (var i = 0; i < 4; i++) {
      raw.push(n.charCodeAt(i));
    }
    raw.push(0xf7);
    // send Data //  
    CMD = [0xf0, 0x04, 0x01, 0x0B];
    raw = raw.concat(CMD);
    for (i = 0; i < data.length; i++) {
      raw.push(data.charCodeAt(i));
    }
    raw.push(0xf7);
    sendArray.push({ 'obj': raw, 'ack': 0x0B });
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

  proto.print = function (cursorX, cursorY, str) {
    var len = arguments.length;
    if (len == 3) {
      _cursorX = cursorX;
      _cursorY = cursorY;
      this._board.send([0xF0, 0x04, 0x01, 0x02, cursorX, cursorY, 0xF7]);
    } else {
      str = cursorX;
      this._board.send([0xF0, 0x04, 0x01, 0x02, _cursorX, _cursorY, 0xF7]);
    }
    var strCMD = [0xF0, 0x04, 0x01, 0x04];
    for (var i = 0; i < str.length; i++) {
      strCMD.push(str.charCodeAt(i));
    }
    strCMD.push(0xF7);
    this._board.send(strCMD);
  }
  scope.module.SSD1306 = SSD1306;
}));