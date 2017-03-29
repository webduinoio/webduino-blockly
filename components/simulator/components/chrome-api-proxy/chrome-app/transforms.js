+(function (scope) {

  'use strict';

  var slice = Array.prototype.slice;

  scope.transforms = scope.transforms || {
    request: {},
    response: {}
  };

  scope.transforms.request['chrome.serial.send'] = function (connectionId, data) {
    return [connectionId, new Uint8Array(data).buffer];
  };

  scope.transforms.response['chrome.serial.onReceive.addListener'] = function (event) {
    return [{
      connectionId: event.connectionId,
      data: slice.call(new Uint8Array(event.data))
    }];
  };

  scope.transforms.request['chrome.bluetoothSocket.send'] = function (socketId, data) {
    return [socketId, new Uint8Array(data).buffer];
  };

  scope.transforms.response['chrome.bluetoothSocket.onReceive.addListener'] = function (event) {
    return [{
      socketId: event.socketId,
      data: slice.call(new Uint8Array(event.data))
    }];
  };

}(window));
