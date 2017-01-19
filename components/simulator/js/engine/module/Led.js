+(function(factory) {
    if (typeof exports === 'undefined') {
        factory(webduino || {});
    } else {
        module.exports = factory;
    }
}(function(scope) {
    'use strict';

    var Pin = scope.Pin,
        Module = scope.Module,
        BoardEvent = scope.BoardEvent,
        proto;

    function Led(board, pin, driveMode) {
        Module.call(this);

        this._board = board;
        this._pin = pin;
        this._driveMode = driveMode || Led.SOURCE_DRIVE;
        this._supportsPWM = undefined;
        this._blinkTimer = null;

        this._board.on(BoardEvent.BEFOREDISCONNECT, this._clearBlinkTimer.bind(this));
        this._board.on(BoardEvent.ERROR, this._clearBlinkTimer.bind(this));

        if (this._driveMode === Led.SOURCE_DRIVE) {
            this._onValue = 1;
            this._offValue = 0;
        } else if (this._driveMode === Led.SYNC_DRIVE) {
            this._onValue = 0;
            this._offValue = 1;
        } else {
            throw new Error('driveMode should be Led.SOURCE_DRIVE or Led.SYNC_DRIVE');
        }

        if (pin.capabilities[Pin.PWM]) {
            board.setDigitalPinMode(pin.number, Pin.PWM);
            this._supportsPWM = true;
        } else {
            board.setDigitalPinMode(pin.number, Pin.DOUT);
            this._supportsPWM = false;
        }
    }

    function checkPinState(self, pin, state, callback) {
        self._board.queryPinState(pin, function(pin) {
            if (pin.state === state) {
                callback.call(self);
            }
        });
    }

    Led.prototype = proto = Object.create(Module.prototype, {

        constructor: {
            value: Led
        },

        intensity: {
            get: function() {
                return this._pin.value;
            },
            set: function(val) {
                if (!this._supportsPWM) {
                    if (val < 0.5) {
                        val = 0;
                    } else {
                        val = 1;
                    }
                }

                if (this._driveMode === Led.SOURCE_DRIVE) {
                    this._pin.value = val;
                } else if (this._driveMode === Led.SYNC_DRIVE) {
                    this._pin.value = 1 - val;
                }
            }
        }

    });

    /**
     * Set led to on.
     * @param {Function} [callback] - Led state changed callback.
     */
    proto.on = function(callback) {
        this._clearBlinkTimer();
        this._pin.value = this._onValue;
        if (typeof callback === 'function') {
            checkPinState(this, this._pin, this._pin.value, callback);
        }
    };

    /**
     * Set led to off.
     * @param {Function} [callback] - Led state changed callback.
     */
    proto.off = function(callback) {
        this._clearBlinkTimer();
        this._pin.value = this._offValue;
        if (typeof callback === 'function') {
            checkPinState(this, this._pin, this._pin.value, callback);
        }
    };

    /**
     * Toggle led between on/off.
     * @param {Function} [callback] - Led state changed callback.
     */
    proto.toggle = function(callback) {
        if (this._blinkTimer) {
            this.off();
        } else {
            this._pin.value = 1 - this._pin.value;
        }
        if (typeof callback === 'function') {
            checkPinState(this, this._pin, this._pin.value, callback);
        }
    };

    /**
     * Set led blinking. Both msec and callback are optional
     * and can be passed as the only one parameter.
     * @param {number} [msec=1000] - Led blinking interval.
     * @param {Function} [callback] - Led state changed callback.
     */
    proto.blink = function(msec, callback) {
        if (arguments.length === 1 && typeof arguments[0] === 'function') {
            callback = arguments[0];
        }
        msec = parseInt(msec);
        msec = isNaN(msec) || msec <= 0 ? 1000 : msec;

        this._clearBlinkTimer();
        this._blinkTimer = this._blink(msec, callback);
    };

    proto._blink = function(msec, callback) {
        var self = this;
        return setTimeout(function() {
            self._pin.value = 1 - self._pin.value;
            if (typeof callback === 'function') {
                checkPinState(self, self._pin, self._pin.value, callback);
            }
            self._blinkTimer = self._blink(msec, callback);
        }, msec);
    };

    proto._clearBlinkTimer = function() {
        if (this._blinkTimer) {
            clearTimeout(this._blinkTimer);
            this._blinkTimer = null;
        }
    };

    Led.SOURCE_DRIVE = 0;
    Led.SYNC_DRIVE = 1;

    scope.module.Led = Led;
}));