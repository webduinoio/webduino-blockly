+(function (window, undef) {

  'use strict';

  var location = window.location;
  var localStorage = window.localStorage;
  var XMLHttpRequest = window.XMLHttpRequest;

  var proto;

  function JSONStorage(root) {
    this._root = root;
    this._ajax = null;
  }

  proto = JSONStorage.prototype;

  proto.backup = function (data, callback) {
    var url = location.href.split('#')[0];
    localStorage.setItem(url, JSON.stringify(data));
    if (typeof callback === 'function') {
      callback(null);
    }
  };

  proto.restore = function (callback) {
    var url = location.href.split('#')[0];
    if (typeof callback === 'function') {
      callback(null, localStorage[url] ? JSON.parse(localStorage[url]) : '');
    }
  };

  proto.link = function (data, callback) {
    makeRequest(this, 'data', data, callback);
  };

  proto.retrieve = function (key, callback) {
    makeRequest(this, 'key', key, callback);
  };

  function makeRequest(self, name, data, callback) {
    if (self._ajax) {
      self._ajax.abort();
    }
    self._ajax = new XMLHttpRequest();
    self._ajax.name = name;
    self._ajax.onreadystatechange = handleRequest.bind(undef, self, callback);
    switch (name) {
    case 'data':
      self._ajax.open('POST', self._root + '.json');
      self._ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      self._ajax.send(JSON.stringify(data));
      break;
    case 'key':
      self._ajax.open('GET', self._root + '/' + data + '.json');
      self._ajax.send();
      break;
    }
  }

  function handleRequest(self, callback) {
    if (self._ajax.readyState === 4) {
      if (self._ajax.status != 200) {
        callback(new Error(self._ajax.status));
      } else {
        var data = self._ajax.responseText.trim();
        if (self._ajax.name === 'data') {
          data = JSON.parse(data).name;
          callback(null, getUrlParts() + '#' + data);
        } else if (self._ajax.name === 'key') {
          if (!data.length) {
            callback(new Error('Unmatched Key: ' + window.location.hash));
          } else {
            data = JSON.parse(data);
            callback(null, data);
          }
        }
      }
      self._ajax = null;
    }
  }

  function getUrlParts() {
    return (location.protocol + '//' + location.host + location.pathname).split('/');
  }

  window.JSONStorage = JSONStorage;

}(window));
