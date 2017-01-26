+(function () {

  "use strict";

  function toggleRunning() {
    navbar.engineToggle();
  }

  function config(obj) {
    if (obj) {
      utils.importLayout(obj);
    } else {
      return utils.exportLayout();
    }
  }

  function language(val) {
    var mapping = {
      'en': 'en',
      'zh-hant': 'zh-tw',
      'zh-hans': 'zh-cn'
    };
    
    setTimeout(function timer() {
      if (app.language) {
        app.language = mapping[val];
      } else {
        setTimeout(timer, 10);
      }
    }, 10);
    
  }

  window.blockly = {
    deviceIds: ['05O0'],
    toggleRunning: toggleRunning,
    config: config,
    lang: language
  };

})();
