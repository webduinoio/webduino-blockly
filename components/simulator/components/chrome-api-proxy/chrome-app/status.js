+(function (window, document) {

  'use strict';

  var node, nodeBT;

  document.addEventListener('DOMContentLoaded', function () {
    node = document.querySelector('#status');
    nodeBT = document.querySelector('#status-bt');

    getNode('refresh').addEventListener('click', function () {
      refreshStatus();
    }, false);

    getNode('disconnect').addEventListener('click', function () {
      chrome.serial.disconnect(parseInt(getNode('disconnId').value), function (e) {
        refreshStatus();
        if (e !== true) {
          alert(e + '');
        }
      });
    });

    getNode('refresh-bt').addEventListener('click', function () {
      refreshStatusBT();
    }, false);

    getNode('disconnect-bt').addEventListener('click', function () {
      chrome.bluetoothSocket.close(parseInt(getNode('disconnId-bt').value), function () {
        refreshStatusBT();
      });
    });

    refreshStatus();
    refreshStatusBT();

    window.addEventListener('focus', function () {
      refreshStatus();
      refreshStatusBT();
    }, false);
  }, false);

  function refreshStatus() {
    var status = {};

    getNode('disconnId').value = '';
    getNode('disconnStatus').innerHTML = '';

    chrome.serial.getDevices(function (devs) {
      status.devices = devs;
      chrome.serial.getConnections(function (conns) {
        status.connections = conns;
        node.innerHTML = '';
        node.appendChild(JsonHuman.format(status));
      });
    });
  }

  function refreshStatusBT() {
    var status = {};

    getNode('disconnId-bt').value = '';
    getNode('disconnStatus-bt').innerHTML = '';

    chrome.bluetooth.getDevices(function (devs) {
      status.devices = devs;
      chrome.bluetoothSocket.getSockets(function (sks) {
        status.sockets = sks;
        nodeBT.innerHTML = '';
        nodeBT.appendChild(JsonHuman.format(status));
      });
    });
  }

  function getNode(id) {
    return document.getElementById(id);
  }

}(window, document));
