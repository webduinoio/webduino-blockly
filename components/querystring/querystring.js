+(function (window, undef) {

  'use strict';

  var location = window.location,
    history = window.history;

  function QueryString(qs) {
    this.dict = {};
    if (!qs) {
      qs = location.search;
    }
    if (qs.charAt(0) == '?') {
      qs = qs.substring(1);
    }

    var re = /([^=&]+)(=([^&]*))?/g,
      match;

    while (match = re.exec(qs)) {
      var key = decodeURIComponent(match[1].replace(/\+/g, ' '));
      var value = match[3] ? QueryString.decode(match[3]) : '';
      if (this.dict[key]) {
        this.dict[key].push(value);
      } else {
        this.dict[key] = [value];
      }
    }
  }

  function makeChange(qs, reload) {
    if (reload) {
      location.search = qs.toString();
    } else {
      var state = history.state || {};
      state.page = qs.toString();
      history.pushState(state, null, qs.toString() + location.hash);
    }
  }

  QueryString.decode = function (s) {
    s = s.replace(/\+/g, ' ');
    s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/gi,
      function (code, hex1, hex2, hex3) {
        var n1 = parseInt(hex1, 16) - 0xE0;
        var n2 = parseInt(hex2, 16) - 0x80;
        if (n1 == 0 && n2 < 32) return code;
        var n3 = parseInt(hex3, 16) - 0x80;
        var n = (n1 << 12) + (n2 << 6) + n3;
        if (n > 0xFFFF) return code;
        return String.fromCharCode(n);
      });
    s = s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/gi,
      function (code, hex1, hex2) {
        var n1 = parseInt(hex1, 16) - 0xC0;
        if (n1 < 2) return code;
        var n2 = parseInt(hex2, 16) - 0x80;
        return String.fromCharCode((n1 << 6) + n2);
      });
    s = s.replace(/%([0-7][0-9A-F])/gi,
      function (code, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      });
    return s;
  };

  QueryString.prototype.get = function (key) {
    var a = this.dict[key];
    return Array.isArray(a) ? a[a.length - 1] : a;
  };

  QueryString.prototype.set = function (key, value, reload) {
    this.dict[key] = value;
    makeChange(this, reload);
  };

  QueryString.prototype.unset = function (key, reload) {
    delete this.dict[key];
    makeChange(this, reload);
  };

  QueryString.prototype.values = function (key) {
    var a = this.dict[key];
    return a ? a : [];
  };

  QueryString.prototype.keys = function () {
    var a = [];
    for (var key in this.dict) {
      a.push(key);
    }
    return a;
  };

  QueryString.prototype.toString = function () {
    return '?' + Object.keys(this.dict).map(function (key) {
      return key + '=' + this.dict[key];
    }.bind(this)).join('&');
  };

  window.QueryString = QueryString;

}(window));
