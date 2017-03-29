+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  function Max7219(board, din, cs, clk) {
    Module.call(this);
    this._board = board;
    this._din = din;
    this._cs = cs;
    this._clk = clk;
    this._intensity = 0;
    this._data = 'ffffffffffffffff';

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.animateStop.bind(this));
    this._board.on(BoardEvent.ERROR, this.animateStop.bind(this));
    this._board.send([0xf0, 4, 8, 0, din.number, cs.number, clk.number, 0xf7]);
  }

  Max7219.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Max7219
    },
    intensity: {
      get: function () {
        return this._intensity;
      },
      set: function (val) {
        if (val >= 0 && val <= 15) {
          this._board.send([0xf0, 4, 8, 3, val, 0xf7]);
          this._intensity = val;
        }
      }
    }
  });

  proto.on = function (data) {
    if (data) {
      this._data = data;
    } else {
      data = this._data;
    }

    if (!data) {
      return false;
    }

    var sendData = [0xf0, 4, 8, 1];
    var i = 0;
    var len = data.length;

    for (; i < len; i++) {
      sendData.push(data.charCodeAt(i));
    }

    sendData.push(0xf7);
    this._board.send(sendData);
  };

  proto.off = function () {
    this._board.send([0xf0, 4, 8, 2, 0xf7]);
  };

  proto.animate = function(data, times, duration, callback) {
    var p = 0;

    if (typeof arguments[arguments.length - 1] === 'function') {
      callback = arguments[arguments.length - 1];
    } else {
      callback = function() {};
    }

    var run = function() {
      this.on(data[p++ % data.length]);
      this._timer = setTimeout(run, times);
    }.bind(this);

    var stop = function() {
      clearTimeout(this._timer);
      callback();
    }.bind(this);

    if (times && times > 0) {
      run();
    }

    if (duration && duration > 0) {
      this._timerDuration = setTimeout(stop, duration);
    }
  };

  proto.animateStop = function() {
    clearTimeout(this._timer);
    clearTimeout(this._timerDuration);
  };

  scope.module.Max7219 = Max7219;
}));