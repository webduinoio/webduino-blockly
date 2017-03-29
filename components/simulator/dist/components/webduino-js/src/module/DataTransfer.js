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
  var _callback;
  var _dataString;

  function toArray(str) {
    var data = [];
    for (var i = 0; i < str.length; i++) {
      data.push(str.charCodeAt(i));
    }
    return data;
  }


  function DataTransfer(board) {
    Module.call(this);
    this._board = board;
    self = this;
    //board.send([0xF0, 0x04, 0x20, dataType /*init*/ , 0xF7]);
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        var data = event.message;
        sending = false;
        if (data[0] == 0x20) {
          switch (data[1] /*dataType*/ ) {
            case 0: //String
              var str = "";
              for (var i = 2; i < data.length; i++) {
                str += String.fromCharCode(data[i]);
              }
              _dataString = str;
              _callback(0, str);
              break;
          }
        }
      });
    startQueue(board);
  }

  DataTransfer.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: DataTransfer
    }
  });

  proto.sendString = function (msg, callback) {
    var cmdArray = [0xF0, 0x04, 0x20, 0x0];
    cmdArray = cmdArray.concat(toArray(msg));
    cmdArray.push(0xF7);
    this._board.send(cmdArray);
    if (callback !== undefined) {
      _callback = callback;
    }
  }

  proto.onMessage = function (callback) {
    if (callback !== undefined) {
      _callback = callback;
    }
  }

  proto.getDataString = function () {
    return _dataString;
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

  scope.module.DataTransfer = DataTransfer;
}));