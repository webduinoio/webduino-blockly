+(function (scope) {
  'use strict';

  var push = Array.prototype.push,
    WebSocketClient = WebSocket;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    proto;

  function WebSocketTransport(options) {
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
    self._client.binaryType = 'arraybuffer';
    self._client.onopen = self._connHandler;
    self._client.onmessage = self._messageHandler;
    self._client.onclose = self._disconnHandler;
    self._client.onerror = self._errorHandler;
  }

  function onConnect(event) {
    this.emit(TransportEvent.OPEN, event);
  }

  function onMessage(event) {
    this.emit(TransportEvent.MESSAGE, new Uint8Array(event.data));
  }

  function onDisconnect(event) {
    delete this._client;
    this.emit(TransportEvent.CLOSE, event);
  }

  function onError(event) {
    this.emit(TransportEvent.ERROR, event);
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && this._client.send(payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  WebSocketTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: WebSocketTransport
    },

    isOpen: {
      get: function () {
        return this._client && this._client.readyState === WebSocketClient.OPEN;
      }
    }

  });

  proto.send = function (payload) {
    if (this._buf.length + payload.length > WebSocketTransport.MAX_PACKET_SIZE) {
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
        delete this._client;
      }
    }
  };

  proto.flush = function () {
    if (this._buf && this._buf.length) {
      this._sendOutHandler();
    }
  };

  WebSocketTransport.MAX_PACKET_SIZE = 64;

  scope.transport.websocket = WebSocketTransport;
}(webduino));
