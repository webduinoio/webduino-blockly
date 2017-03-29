+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var DHT_MESSAGE = [0x04, 0x04],
    MIN_READ_INTERVAL = 1000,
    MIN_RESPONSE_TIME = 30,
    RETRY_INTERVAL = 6000;

  var DhtEvent = {
    READ: 'read',
    READ_ERROR: 'readError'
  };

  function Dht(board, pin) {
    Module.call(this);

    this._type = 'DHT11';
    this._board = board;
    this._pin = pin;
    this._humidity = null;
    this._temperature = null;
    this._lastRecv = null;
    this._readTimer = null;
    this._readCallback = function () {};

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.stopRead.bind(this));
    this._messageHandler = onMessage.bind(this);
    this._board.on(BoardEvent.ERROR, this.stopRead.bind(this));
  }

  function onMessage(event) {
    var message = event.message;

    if (message[0] !== DHT_MESSAGE[0] || message[1] !== DHT_MESSAGE[1]) {
      return;
    } else {
      processDhtData(this, message);
    }
  }

  function processDhtData(self, data) {
    var str = '',
      i = 3,
      MAX = 4,
      dd = [],
      d1, d2;

    if (data[2] === self._pin.number) {

      while (i < data.length) {
        d1 = data[i];
        d2 = data[i + 1];
        str += (d1 - 48);
        d2 && (str += (d2 - 48));
        i += 2;

        if ((i - 3) % MAX === 0) {
          dd.push(parseInt(str) / 100);
          str = '';
        }
      }

      self._lastRecv = Date.now();
      self.emit(DhtEvent.READ, dd[0], dd[1]);
    }
  }

  Dht.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Dht
    },

    humidity: {
      get: function () {
        return this._humidity;
      }
    },

    temperature: {
      get: function () {
        return this._temperature;
      }
    }
  });

  proto.read = function (callback, interval) {
    var self = this,
      timer;

    self.stopRead();

    if (typeof callback === 'function') {
      self._readCallback = function (humidity, temperature) {
        self._humidity = humidity;
        self._temperature = temperature;
        callback({
          humidity: humidity,
          temperature: temperature
        });
      };
      self._board.on(BoardEvent.SYSEX_MESSAGE, self._messageHandler);
      self.on(DhtEvent.READ, self._readCallback);

      timer = function () {
        self._board.sendSysex(DHT_MESSAGE[0], [DHT_MESSAGE[1], self._pin.number]);
        if (interval) {
          interval = Math.max(interval, MIN_READ_INTERVAL);
          if (self._lastRecv === null || Date.now() - self._lastRecv < 5 * interval) {
            self._readTimer = setTimeout(timer, interval);
          } else {
            self.stopRead();
            setTimeout(function () {
              self.read(callback, interval);
            }, RETRY_INTERVAL);
          }
        }
      };

      timer();
    } else {
      return new Promise(function (resolve, reject) {
        self.read(function (data) {
          self._humidity = data.humidity;
          self._temperature = data.temperature;
          setTimeout(function () {
            resolve(data);
          }, MIN_RESPONSE_TIME);
        });
      });
    }
  };

  proto.stopRead = function () {
    this.removeListener(DhtEvent.READ, this._readCallback);
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this._lastRecv = null;

    if (this._readTimer) {
      clearTimeout(this._readTimer);
      delete this._readTimer;
    }
  };

  scope.module.DhtEvent = DhtEvent;
  scope.module.Dht = Dht;
}));
