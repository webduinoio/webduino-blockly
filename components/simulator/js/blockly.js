+(function () {

  "use strict";

  var _deviceIds = [];

  function updateDeviceId_() {
    var ArduinoUno = window._components.ArduinoUno;
    var unoIds = [];

    d3.selectAll('svg [data-type="ArduinoUno"]').each(function () {
      unoIds.push(this.id);
    });

    // 在積木及模擬器皆只有一個裝置時，才做
    if (_deviceIds.length === 1 && unoIds.length === 1) {
      ArduinoUno.updateProperty(unoIds[0], {
        deviceId: _deviceIds[0]
      });
    }
  }

  function readyHandler_(func, thisArg, args) {
    if (window.app.isReady()) {
      func.apply(this, args);
    } else {
      setTimeout(function runner() {
        if (window.app.isReady) {
          func.apply(this, args);
        } else {
          setTimeout(runner, 10);
        }
      }, 10);
    }
  }

  function toggleRunning() {
    updateDeviceId_();
    window.navbar.engineToggle();
  }

  function setDeviceId(ids) {
    if (typeof ids === 'string') {
      _deviceIds = [ids];
    }

    if (Array.isArray(ids)) {
      _deviceIds = ids.slice();
    }
  }

  function config(obj) {
    if (!window.app.isReady()) {
      readyHandler_(config, this, [obj]);
      return;
    }

    if (obj) {
      utils.importLayout(obj);
    } else {
      return utils.exportLayout();
    }
  }

  function language(val) {
    if (!window.app.isReady()) {
      readyHandler_(language, this, [val]);
      return;
    }

    var mapping = {
      'en': 'en',
      'zh-hant': 'zh-tw',
      'zh-hans': 'zh-cn'
    };

    window.app.language = mapping[val];
    $('#lang').selectpicker('val', mapping[val]);
  }

  window.blockly = {
    setDeviceId: setDeviceId,
    toggleRunning: toggleRunning,
    config: config,
    lang: language
  };

})();
