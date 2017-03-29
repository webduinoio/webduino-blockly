+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var IRRecvEvent = {
    MESSAGE: 'message',
    MESSAGE_ERROR: 'messageError'
  };

  function IRRecv(board, pin) {
    Module.call(this);
    this._board = board;
    this._pin = pin;
    this._messageHandler = onMessage.bind(this);
    this._recvCallback = function () {};
    this._recvErrorCallback = function () {};
    this._board.send([0xf0, 0x04, 0x0A, 0x01, 0xf7]);
  }

  function onMessage(event) {
    var recvChk = [0x04, 0x10];
    var msg = event.message;
    var data = msg.slice(2);
    var str = '';
    var i, tp, len;

    for (i = 0, len = recvChk.length; i < len; i++) {
      if (recvChk[i] !== msg[i]) {
        return false;
      }
    }

    for (i = 0; i < data.length; i++) {
      tp = String.fromCharCode(data[i]);
      str += tp.toLowerCase();
    }

    if (str !== 'ffffffff') {
      this.emit(IRRecvEvent.MESSAGE, str);
    } else {
      this.emit(IRRecvEvent.MESSAGE_ERROR, str, msg);
    }
  }

  IRRecv.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: IRRecv
    },
    state: {
      get: function () {
        return this._state;
      },
      set: function (val) {
        this._state = val;
      }
    }
  });

  proto.on = function (callback, errorCallback) {
    var aryCode = [0xf0, 0x04, 0x0A, 0x00];

    if (typeof callback !== 'function') {
      callback = function () {};
    }

    if (typeof errorCallback !== 'function') {
      errorCallback = function () {};
    }

    if (this._pin) {
      aryCode.push(this._pin.number, 0xf7);
      this._board.send(aryCode);
      this._state = 'on';

      this._recvCallback = function (value) {
        callback(value);
      };

      this._recvErrorCallback = function (value, msg) {
        errorCallback(value, msg);
      };

      this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
      this.addListener(IRRecvEvent.MESSAGE, this._recvCallback);
      this.addListener(IRRecvEvent.MESSAGE_ERROR, this._recvErrorCallback);
    }
  };

  proto.off = function () {
    this._board.send([0xf0, 0x04, 0x0A, 0x01, 0xf7]);
    this._state = 'off';

    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.removeListener(IRRecvEvent.MESSAGE, this._recvCallback);
    this.removeListener(IRRecvEvent.MESSAGE_ERROR, this._recvErrorCallback);
    this._recvCallback = null;
    this._recvErrorCallback = null
  };

  scope.module.IRRecv = IRRecv;
}));