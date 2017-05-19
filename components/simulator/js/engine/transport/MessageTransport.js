+(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    util = scope.util,
    proto;

  var STATUS = {
    OK: 'OK'
  };

  var TOPIC = {
    PING: '/PING',
    PONG: '/PONG',
    STATUS: '/STATUS'
  };

  function MessageTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._client = null;
    this._timer = null;
    this._sendTimer = null;
    this._buf = [];

    this._status = '';

    this._connHandler = onConnect.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);

    init(this);
  }

  function init(self) {
    self._window = self._options.window || window;

    // 確保接收端已準備好，然後才發訊息
    setTimeout(function () {
      self._connHandler();  
    }, 500);
  }

  function onConnect() {
    var message = {
      destinationName: this._options.device + TOPIC.STATUS,
      payloadString: 'OK'
    };
    this._window.postMessage(message, location.origin);
    this._window.addEventListener("message", this._messageHandler, false);
  }

  function onMessage(event) {
    var message = event.data;
    var dest = message.destinationName
    var oldStatus = this._status;
    var subscribe = [this._options.device + TOPIC.PING];

    if (event.origin !== location.origin) {
      return;
    }
     
    if (subscribe.indexOf(dest) === -1) {
      return;
    }

    switch (dest.substr(dest.lastIndexOf('/') + 1)) {

    case 'STATUS':
      this._status = message.payloadString;
      detectStatusChange(this, this._status, oldStatus);
      break;

    default:
      this.emit(TransportEvent.MESSAGE, message.payloadBytes);
      break;

    }
  }

  function detectStatusChange(self, newStatus, oldStatus) {
    if (newStatus === oldStatus) {
      return;
    }

    if (newStatus === STATUS.OK) {
      self.emit(TransportEvent.OPEN);
    } else {
      self.emit(TransportEvent.ERROR, new Error('board connection failed.'));
    }
  }

  function sendOut() {
    var payload = {
      destinationName: this._options.device + TOPIC.PONG,
      payloadBytes: new Uint8Array(this._buf)
    };
    if (this.isOpen) {
      this._window.postMessage(payload, location.origin);
    }
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  MessageTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: MessageTransport
    },

    isOpen: {
      get: function () {
        return true;
      }
    }

  });

  proto.send = function (payload) {
    if (this._buf.length + payload.length + this._options.device.length + TOPIC.PONG.length + 4 >
      MessageTransport.MAX_PACKET_SIZE) {
      this._sendOutHandler();
    }
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    this._window.removeEventListener("message", this._messageHandler);
    delete this._window;
    delete this._options;
  };

  proto.flush = function () {
    if (this._buf && this._buf.length) {
      this._sendOutHandler();
    }
  };

  scope.transport.message = MessageTransport;
}(webduino));