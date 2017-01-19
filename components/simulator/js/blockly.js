+(function () {

  "use strict";

  if (window.parent === window) {
    return false;
  }

  $('#navbar .glyphicon-play').parent().addClass('hidden');

  var running = false;

  function toggleRunning() {
    running = !running;

    if (running) {
      interact.start();
    } else {
      interact.stop();
    }
  }

  function config(obj) {
    if (obj) {
      utils.importLayout(obj);
    } else {
      return utils.exportLayout();
    }
  }

  window.blockly = {
    deviceIds: ['05O0'],
    start: interact.start,
    stop: interact.stop,
    toggleRunning: toggleRunning,
    config: config
  };

})();
