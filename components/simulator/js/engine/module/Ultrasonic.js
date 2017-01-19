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

  var ULTRASONIC_MESSAGE = 0x01,
    MIN_PING_INTERVAL = 20,
    MIN_RESPONSE_TIME = 30,
    RETRY_INTERVAL = 5000;

  var UltrasonicEvent = {
    PING: 'ping',
    PING_ERROR: 'pingError'
  };

  function Ultrasonic(board, trigger, echo) {
    Module.call(this);

    this._type = 'HC-SR04';
    this._board = board;
    this._trigger = trigger;
    this._echo = echo;
    this._distance = null;
    this._lastRecv = null;
    this._pingTimer = null;
    this._pingCallback = function () {};

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.stopPing.bind(this));
    this._messageHandler = onMessage.bind(this);
    this._board.on(BoardEvent.ERROR, this.stopPing.bind(this));
  }

  function onMessage(event) {
    var message = event.message;

    if (message[0] !== ULTRASONIC_MESSAGE) {
      return;
    } else {
      processUltrasonicData(this, message);
    }
  }

  function processUltrasonicData(self, data) {
    var str = '',
      i = 3,
      d1, d2;

    if (data[1] === self._trigger.number && data[2] === self._echo.number) {

      while (i < data.length) {
        d1 = data[i];
        d2 = data[i + 1];
        str += (d1 - 48);
        d2 && (str += (d2 - 48));
        i += 2;
      }

      self._lastRecv = Date.now();
      self.emit(UltrasonicEvent.PING, parseInt(str));
    }
  }

  Ultrasonic.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Ultrasonic
    },

    distance: {
      get: function () {
        return this._distance;
      }
    }
  });

  proto.ping = function (callback, interval) {
    var self = this,
      timer;

    self.stopPing();

    if (typeof callback === 'function') {
      self._pingCallback = function (distance) {
        self._distance = distance;
        callback(distance);
      };
      self._board.on(BoardEvent.SYSEX_MESSAGE, self._messageHandler);
      self.on(UltrasonicEvent.PING, self._pingCallback);

      timer = function () {
        self._board.sendSysex(ULTRASONIC_MESSAGE, [self._trigger.number, self._echo.number]);
        if (interval) {
          interval = Math.max(interval, MIN_PING_INTERVAL);
          if (self._lastRecv === null || Date.now() - self._lastRecv < 5 * interval) {
            self._pingTimer = setTimeout(timer, interval);
          } else {
            self.stopPing();
            setTimeout(function () {
              self.ping(callback, interval);
            }, RETRY_INTERVAL);
          }
        }
      };

      timer();
    } else {
      return new Promise(function (resolve, reject) {
        self.ping(function (cm) {
          setTimeout(function () {
            resolve(cm);
          }, MIN_RESPONSE_TIME);
        });
      });
    }
  };

  proto.stopPing = function () {
    this.removeListener(UltrasonicEvent.PING, this._pingCallback);
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this._lastRecv = null;

    if (this._pingTimer) {
      clearTimeout(this._pingTimer);
      delete this._pingTimer;
    }
  };

  scope.module.UltrasonicEvent = UltrasonicEvent;
  scope.module.Ultrasonic = Ultrasonic;
}));
