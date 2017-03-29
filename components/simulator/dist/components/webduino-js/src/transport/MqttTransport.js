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

  function MqttTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._client = null;
    this._timer = null;
    this._sendTimer = null;
    this._buf = [];

    this._status = '';

    this._connHandler = onConnect.bind(this);
    this._connFailedHandler = onConnectFailed.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);
    this._disconnHandler = onDisconnect.bind(this);

    init(this);
  }

  function init(self) {
    self._client = new Paho.MQTT.Client(self._options.server,
      '_' + self._options.device + (self._options.multi ? '.' + util.randomId() : '')
    );
    self._client.onMessageArrived = self._messageHandler;
    self._client.onConnectionLost = self._disconnHandler;
    self._client.onConnected = self._connHandler;
    self._client.connect({
      userName: self._options.login || '',
      password: self._options.password || '',
      timeout: MqttTransport.CONNECT_TIMEOUT,
      keepAliveInterval: MqttTransport.KEEPALIVE_INTERVAL,
      onSuccess: self._connHandler,
      onFailure: self._connFailedHandler,
      reconnect: !!self._options.autoReconnect,
      reconnectInterval: MqttTransport.RECONNECT_PERIOD
    });
  }

  function onConnect() {
    this._client.subscribe(this._options.device + TOPIC.PONG);
    this._client.subscribe(this._options.device + TOPIC.STATUS);
  }

  function onConnectFailed(respObj) {
    this.emit(TransportEvent.ERROR, new Error(respObj.errorMessage));
  }

  function onMessage(message) {
    var dest = message.destinationName,
      oldStatus = this._status;

    switch (dest.substr(dest.lastIndexOf('/') + 1)) {

    case 'STATUS':
      this._status = message.payloadString;
      detectStatusChange(this, this._status, oldStatus);
      break;

    default:
      (this._status === STATUS.OK) && this.emit(TransportEvent.MESSAGE, message.payloadBytes);
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

  function onDisconnect(respObj) {
    if (!respObj.errorCode || !respObj.reconnect) {
      delete this._client;
      respObj.errorCode && this.emit(TransportEvent.ERROR, new Error(respObj.errorMessage));
      this.emit(TransportEvent.CLOSE);
    }
  }

  function sendOut() {
    var payload = new Paho.MQTT.Message(new Uint8Array(this._buf).buffer);
    payload.destinationName = this._options.device + TOPIC.PING;
    payload.qos = 0;
    this.isOpen && this._client.send(payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  MqttTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: MqttTransport
    },

    isOpen: {
      get: function () {
        return this._client && this._client.isConnected();
      }
    }

  });

  proto.send = function (payload) {
    if (this._buf.length + payload.length + this._options.device.length + TOPIC.PING.length + 4 >
      MqttTransport.MAX_PACKET_SIZE) {
      this._sendOutHandler();
    }
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    if (this._client) {
      if (this._client.isConnected()) {
        this._client.disconnect();
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

  MqttTransport.RECONNECT_PERIOD = 1;

  MqttTransport.KEEPALIVE_INTERVAL = 15;

  MqttTransport.CONNECT_TIMEOUT = 30;

  MqttTransport.MAX_PACKET_SIZE = 128;

  scope.transport.mqtt = MqttTransport;
}(webduino));
