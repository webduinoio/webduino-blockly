+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent;
  var self;
  var proto;
  var sendLen = 32;
  var lastSendIR = false;
  var debugFlag = false;

  function log(obj) {
    if (debugFlag) {
      console.log(obj);
    }
  }

  function IRRAW(board, pinMapping) {
    Module.call(this);
    this._board = board;
    this.pinSendIR = this.pinRecvIR = -1;
    self = this;
    if (typeof pinMapping === 'object') {
      if (pinMapping['send']) {
        this.pinSendIR = pinMapping['send'];
      }
      if (pinMapping['recv']) {
        this.pinRecvIR = pinMapping['recv'];
      }
    }
    onMessage();
  }

  function onMessage() {
    self._board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (event) {
      var m = event.message;
      //send IR data to Board
      if (m[0] == 0x04 && m[1] == 0x09 && m[2] == 0x0B) {
        log("send IR data to Board callback");
        if (lastSendIR) {
          //store OK
          lastSendIR = false;
          log("send pin:" + self.pinSendIR);
          self._board.send([0xf0, 0x04, 0x09, 0x0C, self.pinSendIR, 0xF7]);
        }
      }
      //trigger IR send
      else if (m[0] == 0x04 && m[1] == 0x09 && m[2] == 0x0C) {
        log("trigger IR send callback...");
        self.irSendCallback();
      }
      //record IR data
      else if (m[0] == 0x04 && m[1] == 0x09 && m[2] == 0x0D) {
        log("record IR callback...");
        var strInfo = '';
        for (var i = 3; i < m.length; i++) {
          strInfo += String.fromCharCode(m[i]);
        }
        self.irData = strInfo.substring(4);
        self.irRecvCallback(self.irData);
      } else {
        log(event);
      }
    });
  }


  function send(startPos, data) {
    var CMD = [0xf0, 0x04, 0x09, 0x0A];
    var raw = [];
    raw = raw.concat(CMD);
    var n = '0000' + startPos.toString(16);
    n = n.substring(n.length - 4);
    for (var i = 0; i < 4; i++) {
      raw.push(n.charCodeAt(i));
    }
    raw.push(0xf7);
    // send Data //  
    CMD = [0xf0, 0x04, 0x09, 0x0B];
    raw = raw.concat(CMD);
    for (i = 0; i < data.length; i++) {
      raw.push(data.charCodeAt(i));
    }
    raw.push(0xf7);
    self._board.send(raw);
  }

  function sendIRCmd(cmd, len) {
    for (var i = 0; i < cmd.length; i = i + len) {
      var data = cmd.substring(i, i + len);
      send(i / 8, data);
    }
    lastSendIR = true;
  }

  IRRAW.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: IRRAW
    }
  });

  proto.recv = function (callback) {
    self.irRecvCallback = callback;
    if (self.pinRecvIR > 0) {
      self._board.send([0xF0, 0x04, 0x09, 0x0D, self.pinRecvIR, 0xF7]);
      log("wait recv...");
    }
  };

  proto.send = function (data, callback) {
    if (self.pinSendIR > 0) {
      sendIRCmd(data, sendLen);
      self.irSendCallback = callback;
    }
  }

  proto.debug = function (val) {
    if (typeof val == 'boolean') {
      self.isDebug = val;
    }
  }

  proto.sendPin = function (pin) {
    this.pinSendIR = pin;
  }
  proto.recvPin = function (pin) {
    this.pinRecvIR = pin;
  }

  scope.module.IRRAW = IRRAW;
}));