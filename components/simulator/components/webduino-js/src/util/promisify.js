+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  if (typeof exports !== 'undefined' && typeof Promise === 'undefined') {
    Promise = require('es6-promise').Promise;
  }

  // source: 
  // https://raw.githubusercontent.com/twistdigital/es6-promisify/release/2.0.0/lib/promisify.js

  // Promise Context object constructor.
  function Context(resolve, reject, custom) {
    this.resolve = resolve;
    this.reject = reject;
    this.custom = custom;
  }

  // Default callback function - rejects on truthy error, otherwise resolves
  function callback(ctx, err, result) {
    if (typeof ctx.custom === 'function') {
      var cust = function () {
        // Bind the callback to itself, so the resolve and reject
        // properties that we bound are available to the callback.
        // Then we push it onto the end of the arguments array.
        return ctx.custom.apply(cust, arguments);
      };
      cust.resolve = ctx.resolve;
      cust.reject = ctx.reject;
      cust.call(null, err, result);
    } else {
      if (err) {
        return ctx.reject(err);
      }
      ctx.resolve(result);
    }
  }

  function promisify(original, custom) {
    return function () {

      // Store original context
      var that = this,
        args = Array.prototype.slice.call(arguments);

      // Return the promisified function
      return new Promise(function (resolve, reject) {

        // Create a Context object
        var ctx = new Context(resolve, reject, custom);

        // Append the callback bound to the context
        args.push(callback.bind(null, ctx));

        // Call the function
        original.apply(that, args);
      });
    };
  }

  scope.util.promisify = promisify;
}));
