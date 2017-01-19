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

    var HX711_MESSAGE = [0x04, 0x15];

    var HX711Event = {
        MESSAGE: 'message'
    };

    function HX711(board, sckPin, dtPin) {
        Module.call(this);
        this._board = board;
        this._dt = !isNaN(dtPin) ? board.getDigitalPin(dtPin) : dtPin;
        this._sck = !isNaN(sckPin) ? board.getDigitalPin(sckPin) : sckPin;

        this._init = false;
        this._weight = 0;
        this._callback = function() {};
        this._messageHandler = onMessage.bind(this);
        this._board.send([0xf0, 0x04, 0x15, 0x00,
            this._sck._number, this._dt._number, 0xf7
        ]);
    }

    function onMessage(event) {
        var msg = event.message;
        if (msg[0] == HX711_MESSAGE[0] && msg[1] == HX711_MESSAGE[1]) {
            this.emit(HX711Event.MESSAGE, msg.slice(2));
        }
    }

    HX711.prototype = proto = Object.create(Module.prototype, {
        constructor: {
            value: HX711
        },
        state: {
            get: function() {
                return this._state;
            },
            set: function(val) {
                this._state = val;
            }
        }
    });

    proto.on = function(callback) {
        var _this = this;
        this._board.send([0xf0, 0x04, 0x15, 0x01, 0xf7]);
        if (typeof callback !== 'function') {
            callback = function() {};
        }
        this._callback = function(rawData) {
            var weight = '';
            for (var i = 0; i < rawData.length; i++) {
                weight += (rawData[i] - 0x30);
            }
            _this._weight = parseFloat(weight);
            callback(_this._weight);
        };
        this._state = 'on';
        this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this.addListener(HX711Event.MESSAGE, this._callback);
    };

    proto.off = function() {
        this._state = 'off';
        this._board.send([0xf0, 0x04, 0x15, 0x02, 0xf7]);
        this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this.removeListener(HX711Event.MESSAGE, this._callback);
        this._callback = null;
    };

    scope.module.HX711 = HX711;
}));