+(function (window, document) {

  'use strict';

  var env = Code.getTags();

  if (env.length === 1 && env[0] === 'smart') {
    if (location.protocol === 'https:') {
      location.protocol = 'http:';
      return;
    }

    window.addEventListener('load', function () {
      document.querySelector('#check-device-online').style.display = 'none';
      document.querySelector('#blockly-to-website').style.display = 'none';
    }, false);
  }

}(window, document));
