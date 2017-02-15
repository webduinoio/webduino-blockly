+(function (window, document) {

  'use strict';

  var env = Code.getTags();

  if (env.length === 1 && env[0] === 'smart') {
    if (location.protocol === 'https:') {
      location.protocol = 'http:';
      return;
    }
  }

}(window, document));
