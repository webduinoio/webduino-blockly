var chrome = chrome || {};

chrome._api = (function (window) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    callbackHash = {},
    listenerHash = {},
    apiCalls = 0;

  function proxyRequest(api) {
    return function () {
      var params = slice.call(arguments),
        id = ++apiCalls + '';

      if (typeof params[params.length - 1] === 'function') {
        callbackHash[id] = params.pop();
      }
      invoke(id, api, params);
    };
  }

  function proxyAddListener(api) {
    return function (listener) {
      var id = ++apiCalls + '';

      if (typeof listener === 'function') {
        listenerHash[id] = listener;
        invoke(id, api, []);
      }
    };
  }

  function proxyRemoveListener(api) {
    return function (listener) {
      Object.keys(listenerHash).some(function (id) {
        if (listenerHash[id] === listener) {
          delete listenerHash[id];
          invoke(id, api, []);
          return true;
        }
      });
    };
  }

  function invoke(id, method, params) {
    delete chrome.runtime.lastError;
    window.postMessage({
      jsonrpc: '2.0',
      id: id,
      method: method,
      params: params
    }, window.location.origin);
  }

  window.addEventListener('message', function (event) {
    var msg = event.data;

    if (msg.jsonrpc && !msg.method) {
      if (msg.exception) {
        if (callbackHash[msg.id]) {
          delete callbackHash[msg.id];
        }
        throw new Error(msg.exception);
      } else {
        if (msg.error) {
          chrome.runtime.lastError = {
            message: msg.error
          };
        }
        if (callbackHash[msg.id]) {
          callbackHash[msg.id].apply(undef, msg.result);
          delete callbackHash[msg.id];
        } else if (listenerHash[msg.id]) {
          listenerHash[msg.id].apply(undef, msg.result);
        }
      }
    }
  }, false);

  return {
    proxyRequest: proxyRequest,
    proxyAddListener: proxyAddListener,
    proxyRemoveListener: proxyRemoveListener
  };

}(window));

chrome.runtime = chrome.runtime || {};
