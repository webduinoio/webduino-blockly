+(function (scope) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    transReq = scope.transforms.request,
    transRes = scope.transforms.response,
    listenerMap = {},
    portMap = {},
    objCache = {};

  chrome.app.runtime.onLaunched.addListener(function () {

    chrome.app.window.create('status.html', {
      id: "status",
      innerBounds: {
        width: 480,
        height: 640,
        minWidth: 480,
        maxWidth: 480,
        minHeight: 640,
        maxHeight: 640
      }
    });

    chrome.runtime.onConnectExternal.addListener(function (port) {
      if (!port.name) {
        return;
      }

      portMap[port.name] = port;

      port.onMessage.addListener(function (msg) {
        if (msg.method) {
          invoke(port.name, msg.id, msg.method, msg.params);
        }
      });

      port.onDisconnect.addListener(function (port) {
        delete portMap[port.name];
        cleanupListener(port.name);
      });
    });

  });

  function invoke(senderId, id, method, params) {
    var m = normalize(method),
      obj = resolve(m),
      ctx = resolve(m.split('.').slice(0, -1).join('.'));

    if (m.indexOf('.addListener') === m.length - 12) {
      addListener(m.substr(0, m.length - 12), senderId, id);
    } else if (m.indexOf('.removeListener') === m.length - 15) {
      removeListener(m.substr(0, m.length - 15), senderId, id);
    } else {
      if (typeof obj === 'function') {
        params = transformParams(m, params, transReq, ctx);
        try {
          obj.apply(ctx, params.concat(callback));
        } catch (e) {
          portMap[senderId].postMessage({
            jsonrpc: '2.0',
            id: id,
            exception: e.message
          });
        }
      }

      function callback() {
        var args = slice.call(arguments),
          port = portMap[senderId];

        if (!port) {
          delete portMap[senderId];
          cleanupListener(senderId);
          return;
        }

        if (chrome.runtime.lastError) {
          port.postMessage({
            jsonrpc: '2.0',
            id: id,
            error: chrome.runtime.lastError.message
          });
        } else {
          args = transformParams(m, args, transRes, ctx);
          port.postMessage({
            jsonrpc: '2.0',
            id: id,
            result: args
          });
        }
      }
    }
  }

  function transformParams(name, params, map, ctx) {
    var func = map[name];

    if (typeof func === 'function') {
      return func.apply(ctx, params);
    }
    return params;
  }

  function addListener(objName, portName, id) {
    if (listenerMap[objName]) {
      listenerMap[objName].receivers.push({
        portName: portName,
        id: id
      });
    } else {
      listenerMap[objName] = {
        listener: function () {
          var args = transformParams(objName + '.addListener', slice.call(arguments),
            transRes, resolve(objName));

          listenerMap[objName].receivers.forEach(function (receiver, idx) {
            var rcvPort = receiver.portName;

            if (!portMap[rcvPort]) {
              delete portMap[rcvPort];
              cleanupListener(rcvPort);
            } else {
              portMap[rcvPort].postMessage({
                jsonrpc: '2.0',
                id: receiver.id,
                result: args
              });
            }
          });
        },
        receivers: [{
          portName: portName,
          id: id
        }]
      };
      resolve(objName).addListener(listenerMap[objName].listener);
    }
  }

  function removeListener(objName, portName, id) {
    if (listenerMap[objName]) {
      if (typeof id === 'undefined') {
        listenerMap[objName].receivers = listenerMap[objName].receivers.filter(function (receiver) {
          return receiver.portName !== portName;
        });
      } else {
        listenerMap[objName].receivers.some(function (receiver, idx) {
          if (receiver.portName === portName && receiver.id === id) {
            listenerMap[objName].receivers.splice(idx, 1);
            return true;
          }
        });
      }
      if (listenerMap[objName].receivers.length === 0) {
        resolve(objName).removeListener(listenerMap[objName].listener);
        delete listenerMap[objName];
      }
    }
  }

  function cleanupListener(portName) {
    Object.keys(listenerMap).forEach(function (objName) {
      removeListener(objName, portName);
    });
  }

  function normalize(method) {
    return (method.indexOf('window.') === 0) ? method.substring(7) : method;
  }

  function resolve(name) {
    var tmpName = '';

    return (objCache[name]) ||
      name.split('.').reduce(function (obj, prop) {
        tmpName += ((tmpName ? '.' : '') + prop);
        if (obj && obj[prop]) {
          objCache[tmpName] = obj[prop];
          return obj[prop];
        } else {
          return undef;
        }
      }, scope);
  }

}(window));
