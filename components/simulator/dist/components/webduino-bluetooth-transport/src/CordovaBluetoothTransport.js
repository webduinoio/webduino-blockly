+(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    proto;

  function CordovaBluetoothTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._sendTimer = null;
    this._isConnected = false;
    this._nop = function () {};
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
    bluetoothSerial.subscribeRawData(self._messageHandler, self._errorHandler);
    bluetoothSerial.connect(options.address, self._connHandler, self._errorHandler);
  }

  function onConnect() {
    this._isConnected = true;
    this.emit(TransportEvent.OPEN);
  }

  function onMessage(message) {
    this.emit(TransportEvent.MESSAGE, new Uint8Array(message));
  }

  function onDisconnect() {
    if (this._isConnected) {
      bluetoothSerial.unsubscribeRawData();
      this._isConnected = false;
      this.emit(TransportEvent.CLOSE);
    }
  }

  function onError(errMsg) {
    this.emit(TransportEvent.ERROR, new Error(errMsg));
    bluetoothSerial.isConnected(this._nop, this._disconnHandler);
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && bluetoothSerial.write(payload, this._nop, this._errorHandler);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  CordovaBluetoothTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: CordovaBluetoothTransport
    },

    isOpen: {
      get: function () {
        return this._isConnected;
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
    if (this._isConnected) {
      bluetoothSerial.disconnect(this._disconnHandler, this._disconnHandler);
    }
  };

  scope.transport.bluetooth = CordovaBluetoothTransport;
}(webduino));
