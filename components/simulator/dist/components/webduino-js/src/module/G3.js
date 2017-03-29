+(function(factory) {
    if (typeof exports === 'undefined') {
        factory(webduino || {});
    } else {
        module.exports = factory;
    }
}(function(scope) {
    'use strict';

    var Module = scope.Module,
        BoardEvent = scope.BoardEvent,
        proto;

    var G3_MESSAGE = [0x04, 0x10],
        MIN_READ_INTERVAL = 1000,
        MIN_RESPONSE_TIME = 30,
        RETRY_INTERVAL = 6000;

    var G3Event = {
        READ: 'read',
        READ_ERROR: 'readError'
    };

    function G3(board, rx, tx) {
        Module.call(this);

        this._type = 'G3';
        this._board = board;
        this._rx = rx;
        this._tx = tx;
        this._pm25 = null;
        this._pm10 = null;
        this._readTimer = null;
        this._readCallback = function() {};

        this._board.on(BoardEvent.BEFOREDISCONNECT, this.stopRead.bind(this));
        this._messageHandler = onMessage.bind(this);
        this._board.on(BoardEvent.ERROR, this.stopRead.bind(this));
        this._board.sendSysex(G3_MESSAGE[0], [G3_MESSAGE[1], 0, rx.number, tx.number]);
    }

    function onMessage(event) {
        var message = event.message;

        if (message[0] !== G3_MESSAGE[0] || message[1] !== G3_MESSAGE[1]) {
            return;
        } else {
            processG3Data(this, message);
        }
    }

    function processG3Data(self, data) {
        var str = '',i = 1;
        for(var i=2;i<data.length;i++){
            str += String.fromCharCode(data[i]);
        }
        str = str.split(',');
        self._lastRecv = Date.now();
        self.emit(G3Event.READ, str[0], str[1]);
    }

    G3.prototype = proto = Object.create(Module.prototype, {
        constructor: {
            value: G3
        },

        pm25: {
            get: function() {
                return this._pm25;
            }
        },

        pm10: {
            get: function() {
                return this._pm10;
            }
        }
    });

    proto.read = function(callback, interval) {
        var self = this,
            timer;

        self.stopRead();

        if (typeof callback === 'function') {
            self._readCallback = function(pm25, pm10) {
                self._pm25 = pm25;
                self._pm10 = pm10;
                callback({
                    pm25: pm25,
                    pm10: pm10
                });
            };
            self._board.on(BoardEvent.SYSEX_MESSAGE, self._messageHandler);
            self.on(G3Event.READ, self._readCallback);

            timer = function() {
                self._board.sendSysex(G3_MESSAGE[0], [G3_MESSAGE[1], 3]);
                if (interval) {
                    interval = Math.max(interval, MIN_READ_INTERVAL);
                    if (self._lastRecv === null || Date.now() - self._lastRecv < 5 * interval) {
                        self._readTimer = setTimeout(timer, interval);
                    } else {
                        self.stopRead();
                        setTimeout(function() {
                            self.read(callback, interval);
                        }, RETRY_INTERVAL);
                    }
                }
            };

            timer();
        } else {
            return new Promise(function(resolve, reject) {
                self.read(function(data) {
                    self._pm25 = data.pm25;
                    self._pm10 = data.pm10;
                    setTimeout(function() {
                        resolve(data);
                    }, MIN_RESPONSE_TIME);
                });
            });
        }
    };

    proto.stopRead = function() {
        this.removeListener(G3Event.READ, this._readCallback);
        this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this._lastRecv = null;

        if (this._readTimer) {
            clearTimeout(this._readTimer);
            delete this._readTimer;
        }
    };

    scope.module.G3Event = G3Event;
    scope.module.G3 = G3;
}));