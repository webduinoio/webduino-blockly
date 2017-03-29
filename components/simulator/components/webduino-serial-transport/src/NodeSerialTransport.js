'use strict';

var SerialPort = require('serialport').SerialPort,
  webduino = require('webduino-js');

var push = Array.prototype.push;

var Transport = webduino.Transport,
  TransportEvent = webduino.TransportEvent,
  proto;

function NodeSerialTransport(options) {
  Transport.call(this, options);

  this._options = options;
  this._port = null;
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
  self._port = new SerialPort(options.path, {
    baudRate: options.baudRate
  });
  self._port.on('open', self._connHandler);
  self._port.on('data', self._messageHandler);
  self._port.on('close', self._disconnHandler);
  self._port.on('error', self._errorHandler);
}

function onConnect() {
  this.emit(TransportEvent.OPEN);
}

function onMessage(data) {
  this.emit(TransportEvent.MESSAGE, data);
}

function onDisconnect(error) {
  if (error) {
    this.emit(TransportEvent.ERROR, error);
  }
  this._port.removeAllListeners();
  delete this._port;
  this.emit(TransportEvent.CLOSE);
}

function onError(error) {
  this.emit(TransportEvent.ERROR, error);
}

function sendOut() {
  var payload = new Buffer(this._buf);
  this.isOpen && this._port.write(payload);
  clearBuf(this);
}

function clearBuf(self) {
  self._buf = [];
  clearImmediate(self._sendTimer);
  self._sendTimer = null;
}

NodeSerialTransport.prototype = proto = Object.create(Transport.prototype, {

  constructor: {
    value: NodeSerialTransport
  },

  isOpen: {
    get: function () {
      return this._port && this._port.isOpen();
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
  if (this._port) {
    if (this._port.isOpen()) {
      this._port.close();
    } else {
      this._port.removeAllListeners();
      delete this._port;
    }
  }
};

module.exports = NodeSerialTransport;
