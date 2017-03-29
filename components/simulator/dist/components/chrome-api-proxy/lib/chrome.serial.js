chrome.serial = chrome.serial || (function (_api) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    proxyRequest = _api.proxyRequest,
    proxyAddListener = _api.proxyAddListener,
    proxyRemoveListener = _api.proxyRemoveListener,
    proxiedSend = proxyRequest('chrome.serial.send');

  return {
    getDevices: proxyRequest('chrome.serial.getDevices'),

    connect: proxyRequest('chrome.serial.connect'),

    update: proxyRequest('chrome.serial.update'),

    disconnect: proxyRequest('chrome.serial.disconnect'),

    setPaused: proxyRequest('chrome.serial.setPaused'),

    getInfo: proxyRequest('chrome.serial.getInfo'),

    getConnections: proxyRequest('chrome.serial.getConnections'),

    send: function (connectionId, data, callback) {
      proxiedSend.apply(undef, [connectionId, slice.call(new Uint8Array(data)), callback]);
    },

    flush: proxyRequest('chrome.serial.flush'),

    getControlSignals: proxyRequest('chrome.serial.getControlSignals'),

    setControlSignals: proxyRequest('chrome.serial.setControlSignals'),

    setBreak: proxyRequest('chrome.serial.setBreak'),

    clearBreak: proxyRequest('chrome.serial.clearBreak'),

    onReceive: {
      addListener: proxyAddListener('chrome.serial.onReceive.addListener'),
      removeListener: proxyRemoveListener('chrome.serial.onReceive.removeListener')
    },

    onReceiveError: {
      addListener: proxyAddListener('chrome.serial.onReceiveError.addListener'),
      removeListener: proxyRemoveListener('chrome.serial.onReceiveError.removeListener')
    }
  };

}(chrome._api));
