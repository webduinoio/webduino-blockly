+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var isBrowser = typeof exports === 'undefined';

  var objProto = Object.prototype,
    owns = objProto.hasOwnProperty,
    toStr = objProto.toString;

  function isFn(value) {
    return typeof value === 'function';
  }

  function isObject(value) {
    return '[object Object]' === toStr.call(value);
  }

  function isHash(value) {
    return isObject(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
  }

  function isArray(value) {
    return Array.isArray(value);
  }

  // source:
  // https://github.com/dreamerslab/node.extend/blob/master/lib/extend.js
  function extend() {
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;
    var options, name, src, copy, copy_is_array, clone;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !isFn(target)) {
      target = {};
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      options = arguments[i]
      if (options !== null) {
        if (typeof options === 'string') {
          options = options.split('');
        }
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isHash(copy) || (copy_is_array = isArray(copy)))) {
            if (copy_is_array) {
              copy_is_array = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isHash(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (typeof copy !== 'undefined') {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  }

  function parseURL(str) {
    if (isBrowser) {
      var url = document.createElement('a');
      url.href = str;
      return url;
    } else {
      return require('url').parse(str);
    }
  }

  function randomId() {
    return (Math.random() * Date.now()).toString(36).replace(/\./g, '');
  }

  scope.util = {
    isFn: isFn,
    isFunction: isFn,
    isObject: isObject,
    isHash: isHash,
    isArray: isArray,
    extend: extend,
    parseURL: parseURL,
    randomId: randomId
  };
}));
