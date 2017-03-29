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
  var sendAndAckCount = 0;
  var waitAckAndSend = [];
  var _play;

  function DFPlayer(board, RX, TX) {
    Module.call(this);
    this._board = board;
    this._rx = RX;
    this._tx = TX;
    self = this;
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        sendAndAckCount--;
        var m = event.message;
        var resp = m[2];
        sending = false;
        if (waitAckAndSend.length > 0) {
          var cmd = waitAckAndSend.shift();
          self._board.send(cmd);
        }
      });
    startQueue(board);
  }

  DFPlayer.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: DFPlayer
    },
    play: {
      get: function () {
        return _play;
      },
      set: function (val) {
        _play = val;
      }
    }
  });

  proto.init = function () {
    var cmd = [0xF0, 0x04, 0x19, 0x0 /*init*/ , this._rx, this._tx, 0xF7];
    sendAndAckCount++;
    this._board.send(cmd);
  }

  proto.play = function (num) {
    var cmd = [0xF0, 0x04, 0x19, 0x01, num, 0xF7];
    sendAndAckCount++;
    waitAckAndSend.push(cmd);
  }

  proto.start = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x02 /*Start*/ , 0xF7]);
  }

  proto.stop = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x03 /*Stop*/ , 0xF7]);
  }

  proto.pause = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x04 /*Pause*/ , 0xF7]);
  }

  proto.volume = function (volume) {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x05, volume, 0xF7]);
  }

  proto.previous = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x06 /*Previous*/ , 0xF7]);
  }

  proto.next = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x07 /*Next*/ , 0xF7]);
  }

  proto.loop = function (num) {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x08, num, 0xF7]);
  }

  function startQueue(board) {
    setInterval(function () {
      if (sendAndAckCount == waitAckAndSend.length && waitAckAndSend.length > 0) {
        var cmd = waitAckAndSend.shift();
        board.send(cmd);
      }
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

  scope.module.DFPlayer = DFPlayer;
}));