+(function (window) {

  'use strict';

  var PROXY_ID = 'pddlkidaibpbhpkfbhkbeolbagpmkhhn';

  var ready, port;

  ready = true;
  port = chrome.runtime.connect(PROXY_ID, {
    name: randomId()
  });
  port.onMessage.addListener(receiveMessage);
  port.onDisconnect.addListener(onDisconnect);

  window.addEventListener('message', function (event) {
    var msg = event.data;

    if (msg.jsonrpc && msg.method) {
      ready && port.postMessage(msg);
    }
  }, false);

  function receiveMessage(msg) {
    window.postMessage(msg, window.location.origin);
  }

  function onDisconnect() {
    ready = false;
    port.onMessage.removeListener(receiveMessage);
    port.onDisconnect.removeListener(onDisconnect);
  }

  function randomId() {
    return (Math.random() * Date.now()).toString(36).replace(/\./g, '');
  }

}(window));
