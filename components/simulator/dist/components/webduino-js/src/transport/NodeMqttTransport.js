'use strict';

var mqtt = require('mqtt'),
  webduino = require('../webduino');

var push = Array.prototype.push;

var Transport = webduino.Transport,
  TransportEvent = webduino.TransportEvent,
  util = webduino.util,
  proto;

var STATUS = {
  OK: 'OK'
};

var TOPIC = {
  PING: '/PING',
  PONG: '/PONG',
  STATUS: '/STATUS'
};

var MQTT_EVENTS = {
  CONNECT: 'connect',
  MESSAGE: 'message',
  CLOSE: 'close',
  ERROR: 'error'
};

function NodeMqttTransport(options) {
  Transport.call(this, options);

  this._options = options;
  this._client = null;
  this._sendTimer = null;
  this._buf = [];

  this._status = '';

  this._connHandler = onConnect.bind(this);
  this._messageHandler = onMessage.bind(this);
  this._sendOutHandler = sendOut.bind(this);
  this._disconnHandler = onDisconnect.bind(this);
  this._errorHandler = onError.bind(this);

  init(this);
}

function init(self) {
  self._client = mqtt.connect(self._options.server, {
    clientId: '_' + self._options.device + (self._options.multi ? '.' + util.randomId() : ''),
    username: self._options.login || '',
    password: new Buffer(self._options.password || ''),
    keepalive: NodeMqttTransport.KEEPALIVE_INTERVAL,
    reconnectPeriod: self._options.autoReconnect ? NodeMqttTransport.RECONNECT_PERIOD * 1000 : 0,
    connectTimeout: NodeMqttTransport.CONNECT_TIMEOUT * 1000
  });
  self._client.on(MQTT_EVENTS.CONNECT, self._connHandler);
  self._client.on(MQTT_EVENTS.MESSAGE, self._messageHandler);
  self._client.on(MQTT_EVENTS.CLOSE, self._disconnHandler);
  self._client.on(MQTT_EVENTS.ERROR, self._errorHandler);
}

function onConnect() {
  this._client.subscribe(this._options.device + TOPIC.PONG);
  this._client.subscribe(this._options.device + TOPIC.STATUS);
}

function onMessage(topic, message, packet) {
  var dest = topic,
    oldStatus = this._status;

  switch (dest.substr(dest.lastIndexOf('/') + 1)) {

  case 'STATUS':
    this._status = message.toString();
    detectStatusChange(this, this._status, oldStatus);
    break;

  default:
    (this._status === STATUS.OK) && this.emit(TransportEvent.MESSAGE, message);
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

function onDisconnect(err) {
  if (err && !this._options.autoReconnect) {
    this.emit(TransportEvent.ERROR, err);
  }
  if (this._client.disconnecting || !this._options.autoReconnect) {
    this._client.removeAllListeners();
    delete this._client;
    this.emit(TransportEvent.CLOSE);
  }
}

function onError(error) {
  this.emit(TransportEvent.ERROR, error);
}

function sendOut() {
  var payload = new Buffer(this._buf);
  this.isOpen && this._client.publish(this._options.device + TOPIC.PING, payload, {
    qos: 0
  });
  clearBuf(this);
}

function clearBuf(self) {
  self._buf = [];
  clearImmediate(self._sendTimer);
  self._sendTimer = null;
}

NodeMqttTransport.prototype = proto = Object.create(Transport.prototype, {

  constructor: {
    value: NodeMqttTransport
  },

  isOpen: {
    get: function () {
      return this._client && this._client.connected;
    }
  }

});

proto.send = function (payload) {
  if (this._buf.length + payload.length + this._options.device.length + TOPIC.PING.length + 4 >
    NodeMqttTransport.MAX_PACKET_SIZE) {
    this._sendOutHandler();
  }
  push.apply(this._buf, payload);
  if (!this._sendTimer) {
    this._sendTimer = setImmediate(this._sendOutHandler);
  }
};

proto.close = function () {
  if (this._client) {
    if (this._client.connected) {
      this._client.end();
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

NodeMqttTransport.RECONNECT_PERIOD = 1;

NodeMqttTransport.KEEPALIVE_INTERVAL = 15;

NodeMqttTransport.CONNECT_TIMEOUT = 30;

NodeMqttTransport.MAX_PACKET_SIZE = 128;

module.exports = NodeMqttTransport;
