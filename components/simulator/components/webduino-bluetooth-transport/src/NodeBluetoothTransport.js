'use strict';

var BluetoothSerialPort = require('bluetooth-serial-port').BluetoothSerialPort,
  webduino = require('webduino-js');

var push = Array.prototype.push;

var Transport = webduino.Transport,
  TransportEvent = webduino.TransportEvent,
  proto;

function NodeBluetoothTransport(options) {
  Transport.call(this, options);

  this._options = options;
  this._btSerial = null;
  this._sendTimer = null;
  this._buf = [];
  this._closed = true;

  this._messageHandler = onMessage.bind(this);
  this._sendOutHandler = sendOut.bind(this);
  this._disconnHandler = onDisconnect.bind(this);
  this._errorHandler = onError.bind(this);

  init(this);
}

function init(self) {
  var options = self._options;

  getBtSerial(options.address, function (err, btSerial) {
    if (err || !btSerial) {
      self.emit(TransportEvent.ERROR, new Error(err));
    } else {
      self._btSerial = btSerial;
      btSerial.on('data', self._messageHandler);
      btSerial.on('closed', self._disconnHandler);
      btSerial.on('failure', self._errorHandler);
      self._closed = false;
      self.emit(TransportEvent.OPEN);
    }
  });
}

function getBtSerial(address, callback) {
  var btSerial = new BluetoothSerialPort();

  btSerial.on('found', function (foundAddr, name) {
    if (foundAddr.replace(/-/g, ':').toUpperCase() === address.toUpperCase()) {
      btSerial.findSerialPortChannel(address, function (channel) {
        btSerial.connect(address, channel, function () {
          callback(null, btSerial);
        }, function () {
          callback('cannot connect');
        });
      }, function () {
        callback('no such device "' + address + '"');
      });
    }
  });

  btSerial.inquire();
}

function onMessage(data) {
  this.emit(TransportEvent.MESSAGE, data);
}

function onDisconnect() {
  this._btSerial.removeAllListeners();
  delete this._btSerial;
  if (!this._closed) {
    this.emit(TransportEvent.CLOSE);
    this._closed = true;
  }
}

function onError(error) {
  if (error) {
    this.emit(TransportEvent.ERROR, error);
  }
}

function sendOut() {
  var payload = new Buffer(this._buf);
  this.isOpen && this._btSerial.write(payload, this._errorHandler);
  clearBuf(this);
}

function clearBuf(self) {
  self._buf = [];
  clearImmediate(self._sendTimer);
  self._sendTimer = null;
}

NodeBluetoothTransport.prototype = proto = Object.create(Transport.prototype, {

  constructor: {
    value: NodeBluetoothTransport
  },

  isOpen: {
    get: function () {
      return this._btSerial && this._btSerial.isOpen();
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
  if (this._btSerial) {
    if (this._btSerial.isOpen()) {
      this._btSerial.close();
    } else {
      this._btSerial.removeAllListeners();
      delete this._btSerial;
    }
  }
};

module.exports = NodeBluetoothTransport;
