+(function () {

  "use strict";

  var _device;

  function updateDeviceId_() {
    var ArduinoUno = window._components.ArduinoUno;
    var unoIds = [];

    d3.selectAll('svg [data-type="ArduinoUno"]').each(function () {
      unoIds.push(this.id);
    });

    // 在積木及模擬器皆只有一個裝置時，才做
    if (_device.length === 1 && unoIds.length === 1) {
      ArduinoUno.updateProperty(unoIds[0], {
        deviceId: _device[0].id,
        local: _device[0].local
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

  function setDevice(device) {
    _device = device.slice();
  }

  function setConfig(obj, cb) {
    cb = cb || function () {};

    if (!window.app.isReady()) {
      readyHandler_(setConfig, this, [obj, cb]);
      return;
    }

    if (!obj) {
      obj = utils.exportLayout();
      obj.data.components = [];
      obj.data.paths = [];
    }

    utils.importLayout(obj);
    cb();
  }

  function getConfig() {
    return utils.exportLayout();
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

  function isReady() {
    return window.app.isReady();
  }

  window.blockly = {
    setDevice: setDevice,
    toggleRunning: toggleRunning,
    setConfig: setConfig,
    getConfig: getConfig,
    lang: language,
    isReady: isReady
  };

})();
