+(function (scope) {
  'use strict';

  var push = Array.prototype.push,
    serial = chrome.serial;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    proto;

  function SerialTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._connectionId = null;
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
    var options = self._options;
    serial.onReceive.addListener(self._messageHandler);
    serial.onReceiveError.addListener(self._errorHandler);
    serial.connect(options.path, {
      bitrate: options.baudRate
    }, self._connHandler);
  }

  function onConnect(connectionInfo) {
    this._connectionId = connectionInfo.connectionId;
    this.emit(TransportEvent.OPEN);
  }

  function onMessage(message) {
    if (message.connectionId === this._connectionId) {
      this.emit(TransportEvent.MESSAGE, message.data);
    }
  }

  function onDisconnect(result) {
    serial.onReceive.removeListener(this._messageHandler);
    serial.onReceiveError.removeListener(this._errorHandler);
    delete this._connectionId;
    this.emit(TransportEvent.CLOSE);
  }

  function onError(info) {
    this.emit(TransportEvent.ERROR, new Error(JSON.stringify(info)));
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && serial.send(this._connectionId, payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  SerialTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: SerialTransport
    },

    isOpen: {
      get: function () {
        return !!this._connectionId;
      }
    }

  });

  proto.send = function (payload) {
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    if (this._connectionId) {
      serial.disconnect(this._connectionId, this._disconnHandler);
    }
  };

  scope.transport.serial = SerialTransport;
}(webduino));
