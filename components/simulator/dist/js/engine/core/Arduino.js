+(function(factory) {
    if (typeof exports === 'undefined') {
        factory(webduino || {});
    } else {
        module.exports = factory;
    }
}(function(scope) {
    'use strict';

    var util = scope.util,
        Board = scope.Board,
        BoardEvent = scope.BoardEvent,
        proto;

    function Arduino(options) {
        if (typeof options === 'string') {
            options = {
                transport: 'serial',
                path: options
            };
        }
        options = util.extend(getDefaultOptions(options), options);

        Board.call(this, options);
    }

    function getDefaultOptions(opts) {
        var def = {
            serial: {
                transport: 'serial',
                baudRate: 57600
            },
            bluetooth: {
                transport: 'bluetooth',
                uuid: '1101'
            }
        };

        return def[opts.transport] || {};
    }

    Arduino.prototype = proto = Object.create(Board.prototype, {
        constructor: {
            value: Arduino
        }
    });

    proto.begin = function() {
        this.once(BoardEvent.FIRMWARE_NAME, this._initialVersionResultHandler);
        if (this._options.transport !== 'serial') {
            this.reportFirmware();
        }
    };

    scope.Arduino = Arduino;
}));