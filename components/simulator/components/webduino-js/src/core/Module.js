+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var EventEmitter = scope.EventEmitter;

  function Module() {
    EventEmitter.call(this);
  }

  Module.prototype = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Module
    },

    type: {
      get: function () {
        return this._type;
      }
    }

  });

  scope.Module = Module;
  scope.module = scope.module || {};
}));
