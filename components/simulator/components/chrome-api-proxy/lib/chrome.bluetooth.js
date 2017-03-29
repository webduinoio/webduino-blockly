chrome.bluetooth = chrome.bluetooth || (function (_api) {

  'use strict';

  var proxyRequest = _api.proxyRequest;

  return {
    getAdapterState: proxyRequest('chrome.bluetooth.getAdapterState'),
    getDevice: proxyRequest('chrome.bluetooth.getDevice'),
    getDevices: proxyRequest('chrome.bluetooth.getDevices'),
    startDiscovery: proxyRequest('chrome.bluetooth.startDiscovery'),
    stopDiscovery: proxyRequest('chrome.bluetooth.stopDiscovery')
  };

}(chrome._api));

chrome.bluetoothSocket = chrome.bluetoothSocket || (function (_api) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    proxyRequest = _api.proxyRequest,
    proxyAddListener = _api.proxyAddListener,
    proxyRemoveListener = _api.proxyRemoveListener,
    proxiedSend = proxyRequest('chrome.bluetoothSocket.send');

  return {
    create: proxyRequest('chrome.bluetoothSocket.create'),

    connect: proxyRequest('chrome.bluetoothSocket.connect'),

    update: proxyRequest('chrome.bluetoothSocket.update'),

    disconnect: proxyRequest('chrome.bluetoothSocket.disconnect'),

    close: proxyRequest('chrome.bluetoothSocket.close'),

    setPaused: proxyRequest('chrome.bluetoothSocket.setPaused'),

    getInfo: proxyRequest('chrome.bluetoothSocket.getInfo'),

    getSockets: proxyRequest('chrome.bluetoothSocket.getSockets'),

    send: function (socketId, data, callback) {
      proxiedSend.apply(undef, [socketId, slice.call(new Uint8Array(data)), callback]);
    },

    listenUsingRfcomm: proxyRequest('chrome.bluetoothSocket.listenUsingRfcomm'),

    listenUsingL2cap: proxyRequest('chrome.bluetoothSocket.listenUsingL2cap'),

    onAccept: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onAccept.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onAccept.removeListener')
    },

    onAcceptError: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onAcceptError.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onAcceptError.removeListener')
    },

    onReceive: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onReceive.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onReceive.removeListener')
    },

    onReceiveError: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onReceiveError.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onReceiveError.removeListener')
    }
  };

}(chrome._api));
