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

+(function (window, document, location) {

  'use strict';

  function loadTemplate(url, callback) {
    var link = document.createElement('link'),
      tag = document.getElementsByTagName('script')[0];

    link.rel = 'import';
    link.href = url;
    link.onload = function () {
      var imp = link.import,
        head = imp.querySelector('#head'),
        body = imp.querySelector('#body'),
        css = imp.querySelector('#css');

      callback({
        head: head ? head.innerHTML.trim() : '',
        body: body ? body.innerHTML.trim() : '',
        css: css ? css.innerHTML.trim() : ''
      });
    };

    tag.parentNode.insertBefore(link, tag);
  }

  function assembleHtml(head, body, css, js) {
    var html = '<!doctype html>\n<html>\n\n';

    html += ('<head>' +
      (head ? '\n  ' + head + '\n' : '') +
      (css ? '\n  <style>' + css + '</style>\n' : '') +
      '</head>\n\n');
    html += ('<body>' +
      (body ? '\n  ' + body + '\n' : '') +
      (js ? '\n  <script>' + js + '</script>\n' : '') +
      '</body>\n\n');

    return html;
  }

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

  function translate(html, msg) {
    var $wrap = $('<div/>', {
      html: html
    });

    $wrap.find('[data-translation]').each(function () {
      $(this).html(msg[$(this).data('translation')]).removeAttr('data-translation');
    });

    return $wrap.wrap('<div/>').parent().html();
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
      data.html = assembleHtml(data.head, data.body);

      post('//jsfiddle.net/api/post/library/pure/', data);
    },

    codepen: function (config) {
      var data = config.data;
      var jsPreprocessorMap = {
        jsx: 'babel'
      };

      if (config.jsPreprocessor) {
        data.js_pre_processor = jsPreprocessorMap[config.jsPreprocessor];
      }
      data.html = assembleHtml(data.head, data.body);

      post('//codepen.io/pen/define/', {
        data: data
      });
    },

    jsbin: function (config) {
      var data = config.data;

      if (config.jsPreprocessor) {
        data[config.jsPreprocessor] = data.js;
        delete data.js;
      }
      data.html = assembleHtml(data.head, data.body);
      config.modes = config.modes || 'html,css,js,output';

      post('//bin.webduino.io?' + config.modes, data);
    },

    sandbox: function (frame, data) {
      var code = assembleHtml(data.head, data.body, data.css, data.js);

      frame.addEventListener('load', function () {
        frame.style.display = 'block';
      }, false);
      frame.style.display = 'none';
      frame.contentWindow.document.open();
      frame.contentWindow.document.write(code);
      frame.contentWindow.document.close();
    },

    liveview: function (storage, data, callback) {
      var code = assembleHtml(data.head, data.body, data.css, data.js),
        parts = (location.protocol + '//' + location.host + location.pathname).split('/');

      parts.pop();
      storage.link(code, function (err, url) {
        if (!err && url && typeof callback === 'function') {
          callback(parts.join('/') + '/live-preview.html' + '#' + url.split('#')[1]);
        }
      });
    }
  };

  window.launcher = {
    loadTemplate: loadTemplate,
    translate: translate,
    jsfiddle: launchers.jsfiddle,
    codepen: launchers.codepen,
    jsbin: launchers.jsbin,
    sandbox: launchers.sandbox,
    liveview: launchers.liveview
  };

}(window, window.document, window.location));
