'use strict';

var WebSocketClient = require('ws'),
  webduino = require('../webduino');

var push = Array.prototype.push;

var Transport = webduino.Transport,
  TransportEvent = webduino.TransportEvent,
  proto;

function NodeWebSocketTransport(options) {
  Transport.call(this, options);

  this._options = options;
  this._client = null;
  this._sendTimer = null;
  this._buf = [];

  this._connHandler = onConnect.bind(this);
  this._messageHandler = onMessage.bind(this);
  this._sendOutHandler = sendOut.bind(this);
  this._disconnHandler = onDisconnect.bind(this);
  this._errorHandler = onError.bind(this);

  init(this);
}

function init(self) {
  var url = self._options.url;
  self._options.url = url.indexOf('ws://') === 0 ? url : 'ws://' + url;
  self._client = new WebSocketClient(self._options.url);
  self._client.on('open', self._connHandler);
  self._client.on('message', self._messageHandler);
  self._client.on('close', self._disconnHandler);
  self._client.on('error', self._errorHandler);
}

function onConnect() {
  this.emit(TransportEvent.OPEN);
}

function onMessage(data) {
  this.emit(TransportEvent.MESSAGE, data);
}

function onDisconnect(code, msg) {
  this._client.removeAllListeners();
  delete this._client;
  this.emit(TransportEvent.CLOSE, code, msg);
}

function onError(error) {
  this.emit(TransportEvent.ERROR, error);
}

function sendOut() {
  var payload = new Buffer(this._buf);
  this.isOpen && this._client.send(payload);
  clearBuf(this);
}

function clearBuf(self) {
  self._buf = [];
  clearImmediate(self._sendTimer);
  self._sendTimer = null;
}

NodeWebSocketTransport.prototype = proto = Object.create(Transport.prototype, {

  constructor: {
    value: NodeWebSocketTransport
  },

  isOpen: {
    get: function () {
      return this._client && this._client.readyState === WebSocketClient.OPEN;
    }
  }

});

proto.send = function (payload) {
  if (this._buf.length + payload.length > NodeWebSocketTransport.MAX_PACKET_SIZE) {
    this._sendOutHandler();
  }
  push.apply(this._buf, payload);
  if (!this._sendTimer) {
    this._sendTimer = setImmediate(this._sendOutHandler);
  }
};

proto.close = function () {
  if (this._client) {
    if (this._client.readyState === WebSocketClient.OPEN) {
      this._client.close();
    } else {
      this._client.removeAllListeners();
      delete this._client;
    }
  }
};

proto.flush = function () {
  if (this._buf && this._buf.length) {
    this._sendOutHandler();
  }
};

NodeWebSocketTransport.MAX_PACKET_SIZE = 64;

module.exports = NodeWebSocketTransport;
