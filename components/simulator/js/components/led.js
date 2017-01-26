+(function(global, factory) {
  var obj;
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    if (!global._components) global._components = {};
    obj = factory();
    global._components[obj.type] = obj;
  }
})(this, function() {
  "use strict";
  
  var FILE_NAME = 'media/svg/led.svg';
  var proto;

  function Led(id) {
    this._id = id;
    this._elem = d3.select('#' + id);
  }

  Led.type = 'Led';

  Led.labelKey = 'components.led.label';

  Led.icon = 'media/icon/preview-led.png';

  Led.i18n = {
    "en": {
      "components.led.label": "LED"
    },
    "zh-tw": {
      "components.led.label": "LED 燈"
    },
    "zh-cn": {
      "components.led.label": "LED 灯"
    }
  };

  Led.prototype = proto = Object.create(Led.prototype, {

    intensity: {
      get: function() {
        return this._elem.select('[name="ledOn"]').attr('opacity');
      },
      set: function(val) {
        this._elem.select('[name="ledOn"]').attr('opacity', val);
      }
    }

  });

  proto.destroy = function () {
    this.intensity = 0;
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    Led.template = g.outerHTML;
  });

  return Led;
});