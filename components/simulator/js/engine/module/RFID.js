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

  var RFIDEvent = {
    ENTER: 'enter',
    LEAVE: 'leave'
  };

  function RFID(board) {
    Module.call(this);

    this._board = board;
    this._isReading = false;
    this._enterHandlers = [];
    this._leaveHandlers = [];

    this._messageHandler = onMessage.bind(this);
    this._board.on(BoardEvent.BEFOREDISCONNECT, this.destroy.bind(this));
    this._board.on(BoardEvent.ERROR, this.destroy.bind(this));
    this._board.send([0xf0, 0x04, 0x0f, 0x00, 0xf7]);
  }

  function onMessage(event) {
    var _this = this;
    var msg = event.message;
    var val;

    if (!msg.length) {
      return false;
    }

    if (msg.length === 1) {
      val = 0;
      _this._leaveHandlers.forEach(function (fn, idx, ary) {
        fn.call(_this, val);
      });
      _this.emit(RFIDEvent.LEAVE, val);
    } else {
      val = String.fromCharCode.apply(null, msg);
      _this._enterHandlers.forEach(function (fn, idx, ary) {
        fn.call(_this, val);
      });
      _this.emit(RFIDEvent.ENTER, val);
    }
  }

  RFID.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: RFID
    },

    isReading: {
      get: function () {
        return this._isReading;
      }
    }
  });

  proto.read = function (enterHandler, leaveHandler) {
    if (!this._isReading) {
      this._board.send([0xf0, 0x04, 0x0f, 0x01, 0xf7]);
      this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
      this._isReading = true;
    }

    if (typeof enterHandler === 'function') {
      this._enterHandlers.push(enterHandler);
    }

    if (typeof leaveHandler === 'function') {
      this._leaveHandlers.push(leaveHandler);
    }
  };

  proto.stopRead = function () {
    if (this._isReading) {
      this._board.send([0xf0, 0x04, 0x0f, 0x02, 0xf7]);
      this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
      this._isReading = false;
      this._enterHandlers = [];
      this._leaveHandlers = [];
    }
  };

  proto.off = function (evtType, handler) {
    this.removeListener(evtType, handler);
  };

  proto.destroy = function () {
    this.stopRead();
    this.removeAllListeners(RFIDEvent.ENTER);
    this.removeAllListeners(RFIDEvent.LEAVE);
  };

  scope.module.RFIDEvent = RFIDEvent;
  scope.module.RFID = RFID;
}));
