/*
{
  data: {
    html: '...',
    css: '...',
    js: '...'
  },
  jsPreprocessor: 'jsx',
  modes: 'js,output'
}
*/

+(function (global) {

  'use strict';

  function post(url, data) {
    var form = document.createElement("form");

    form.action = url;
    form.method = 'POST';
    if (data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var input = document.createElement("textarea");
          input.name = key;
          input.value = encodeURIComponent(typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]);
          form.appendChild(input);
        }
      }
    }
    form.style.display = 'none';

    document.body.appendChild(form);
    form.submit();
  }

  var launchers = {
    jsfiddle: function (config) {
      var data = config.data;
      var jsPreprocessorMap = {
        jsx: 3
      };

      data.wrap = 'b';
      if (config.jsPreprocessor) {
        data.panel_js = jsPreprocessorMap[config.jsPreprocessor];
      }

      post('http://jsfiddle.net/api/post/library/pure/', data);
    },

    codepen: function (config) {
      var data = config.data;
      var jsPreprocessorMap = {
        jsx: 'babel'
      };

      if (config.jsPreprocessor) {
        data.js_pre_processor = jsPreprocessorMap[config.jsPreprocessor];
      }

      post('http://codepen.io/pen/define/', {
        data: data
      });
    },

    jsbin: function (config) {
      var data = config.data;

      if (config.jsPreprocessor) {
        data[config.jsPreprocessor] = data.js;
        delete data.js;
      }

      config.modes = config.modes || 'html,css,js,output';

      post('https://bin.webduino.io?' + config.modes, data);
    }
  };

  global.launchers = launchers;

}(window));
