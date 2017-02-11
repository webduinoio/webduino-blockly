+(function () {

  "use strict";

  function toggleRunning() {
    navbar.engineToggle();
  }

  function config(obj) {
    if (!app.isReady()) {
      readyHandler(config, this, [obj]);
      return;
    }
    
    if (obj) {
      utils.importLayout(obj);
    } else {
      return utils.exportLayout();
    }
  }

  function language(val) {
    if (!app.isReady()) {
      readyHandler(language, this, [val]);
      return;
    }

    var mapping = {
      'en': 'en',
      'zh-hant': 'zh-tw',
      'zh-hans': 'zh-cn'
    };

    app.language = mapping[val];
    $('#lang').selectpicker('val', mapping[val]);    
  }

  function readyHandler(func, thisArg, args) {
    if (app.isReady()) {
      func.apply(this, args);
    } else {
      setTimeout(function runner() {
        if (app.isReady) {
          func.apply(this, args);
        } else {
          setTimeout(runner, 10);
        }
      }, 10);
    }
  }

  window.blockly = {
    deviceIds: ['05O0'],
    toggleRunning: toggleRunning,
    config: config,
    lang: language
  };

})();
