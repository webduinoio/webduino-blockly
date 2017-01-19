+(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.HistoryManager = factory();
  }
})(this, function () {

  function HistoryManager() {
    this.stack = [];
    this.activeIndex = 0;
    this.MAXSIZE = 100;
  }

  var proto = HistoryManager.prototype;

  proto.getActive = function () {
    return this.stack[this.activeIndex];
  };

  proto.getLast = function () {
    return this.stack[this.previousIndex];
  };

  proto.getNext = function () {
    return this.stack[this.activeIndex + 1];
  };

  proto.getPrev = function () {
    return this.stack[this.activeIndex - 1];
  };

  proto.add = function (url, data) {
    data = data || {};

    if (this.getNext()) {
      this.clearForward();
    }

    data.url = url;
    this.stack.push(data);

    if (this.stack.length > this.MAXSIZE) {
      this.stack.splice(0, this.stack.length - this.MAXSIZE);
    }

    this.activeIndex = this.stack.length - 1;
  };

  proto.clearForward = function () {
    this.stack = this.stack.slice(0, this.activeIndex + 1);
  };

  proto.find = function (url, stack, earlyReturn) {
    stack = stack || this.stack;

    var entry, i, index;
    var length = stack.length;

    for (i = 0; i < length; i++) {
      entry = stack[i];

      if (decodeURIComponent(url) === decodeURIComponent(entry.url)) {
        index = i;
        if (earlyReturn) {
          return index;
        }
      }
    }

    return index;
  };

  proto.closest = function (url) {
    var a = this.activeIndex;
    var closest = this.find(url, this.stack.slice(0, a));

    if (closest === undefined) {
      closest = this.find(url, this.stack.slice(a), true);
      closest = closest === undefined ? closest : closest + a;
    }

    return closest;
  };

  proto.direct = function (opts) {
    var newActiveIndex = (opts.idx >= 0) ? opts.idx : this.closest(opts.url);
    var a = this.activeIndex;

    if (newActiveIndex !== undefined) {
      this.activeIndex = newActiveIndex;
      this.previousIndex = a;
    }

    if (newActiveIndex < a) {
      (opts.present || opts.back || $.noop)(this.getActive());
    } else if (newActiveIndex > a) {
      (opts.present || opts.forward || $.noop)(this.getActive());
    } else if (newActiveIndex === undefined && opts.missing) {
      opts.missing(this.getActive());
    }
  };

  proto.go = function (steps, callback) {
    var idx = this.activeIndex + parseInt(steps, 10);

    if (idx === this.stack.length) {
      idx = this.stack.length - 1;
    }

    if (idx >= 0) {
      this.direct({
        idx: idx,
        present: callback
      });
    }
  };

  proto.back = function (callback) {
    this.go(-1, callback);
  };

  proto.forward = function (callback) {
    this.go(1, callback);
  };

  return HistoryManager;
});
