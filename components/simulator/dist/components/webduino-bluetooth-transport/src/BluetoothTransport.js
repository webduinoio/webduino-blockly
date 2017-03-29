+(function (scope) {
  'use strict';

  var push = Array.prototype.push,
    bluetooth = chrome.bluetoothSocket;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    retry = 0,
    proto;

  function BluetoothTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._socketId = null;
    this._sendTimer = null;
    this._buf = [];

    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);
    this._disconnHandler = onDisconnect.bind(this);
    this._errorHandler = onError.bind(this);

    init(this);
  }

  function init(self) {
    var options = self._options;

    getSocketId(options.address, function (err, socketId) {
      if (err || !socketId) {
        self.emit(TransportEvent.ERROR, new Error(err));
      } else {
        bluetooth.onReceive.addListener(self._messageHandler);
        bluetooth.onReceiveError.addListener(self._errorHandler);
        bluetooth.connect(socketId, options.address, options.uuid, function () {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            bluetooth.close(socketId, function () {
              bluetooth.onReceive.removeListener(self._messageHandler);
              bluetooth.onReceiveError.removeListener(self._errorHandler);
              if (++retry <= BluetoothTransport.MAX_RETRIES) {
                init(self);
              } else {
                self.emit(TransportEvent.ERROR, new Error('too many retries'));
              }
            });
          } else {
            retry = 0;
            self._socketId = socketId;
            self.emit(TransportEvent.OPEN);
          }
        });
      }
    });
  }

  function getSocketId(address, callback) {
    var socketId;

    chrome.bluetooth.getAdapterState(function (state) {
      if (state.available) {
        chrome.bluetooth.getDevice(address, function (dev) {
          if (dev) {
            bluetooth.getSockets(function (scks) {
              scks.some(function (sck) {
                if (!sck.connected) {
                  socketId = sck.socketId;
                  return true;
                }
              });
              if (typeof socketId === 'undefined') {
                bluetooth.create(function (createInfo) {
                  callback(null, createInfo.socketId);
                });
              } else {
                callback(null, socketId);
              }
            });
          } else {
            callback('No such device "' + address + '"');
          }
        });
      } else {
        callback('Bluetooth adapter not available');
      }
    });
  }

  function onMessage(message) {
    if (message.socketId === this._socketId) {
      this.emit(TransportEvent.MESSAGE, message.data);
    }
  }

  function onDisconnect() {
    bluetooth.onReceive.removeListener(this._messageHandler);
    bluetooth.onReceiveError.removeListener(this._errorHandler);
    delete this._socketId;
    this.emit(TransportEvent.CLOSE);
  }

  function onError(info) {
    this.emit(TransportEvent.ERROR, new Error(JSON.stringify(info)));
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && bluetooth.send(this._socketId, payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  BluetoothTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: BluetoothTransport
    },

    isOpen: {
      get: function () {
        return !!this._socketId;
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
    if (this._socketId) {
      bluetooth.close(this._socketId, this._disconnHandler);
    }
  };

  BluetoothTransport.MAX_RETRIES = 10;

  scope.transport.bluetooth = BluetoothTransport;
}(webduino));
