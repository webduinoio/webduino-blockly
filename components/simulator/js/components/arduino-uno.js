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

  var FILE_NAME = 'media/svg/Arduino-UNO.svg';
  var proto;

  function ArduinoUno(id) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._power = this._elem.select('[name="power"]');
    this._online = this._elem.select('[name="online"]');
    this._PLAYING_X_DISTANCE = 60;
  }

  ArduinoUno.type = 'ArduinoUno';

  ArduinoUno.labelKey = 'components.arduinoUno.label';

  ArduinoUno.icon = 'media/icon/preview-uno.png';

  ArduinoUno.i18n = {
    "en": {
      "components.arduinoUno.label": "Arduino UNO"
    },
    "zh-tw": {
      "components.arduinoUno.label": "Arduino UNO"
    },
    "zh-cn": {
      "components.arduinoUno.label": "Arduino UNO"
    }
  };

  ArduinoUno.updateProperty = function (compId, properties) {
    var d3Comp = d3.select('#' + compId);
    var d3Container = d3Comp.select('[name="property"]');

    Object.keys(properties).forEach(function (name, idx, ary) {
      d3Container.select('[name="' + name + '"]').text(properties[name]);
    });

  };

  ArduinoUno.getProperty = function (compId, propertyName) {
    var d3Comp = d3.select('#' + compId);
    var d3Container = d3Comp.select('[name="property"]');

    return d3Container.select('[name="' + propertyName + '"]').text();
  };

  ArduinoUno.parserPin = function(name) {
    var data = {
      "unoPin-d-unknow1" : "unknow1",
      "unoPin-d-unknow2" : "unknow2",
      "unoPin-d-aref" : "aref",
      "unoPin-d-gnd" : "gnd",
      "unoPin-d-13" : "13",
      "unoPin-d-12" : "12",
      "unoPin-d-11" : "11",
      "unoPin-d-10" : "10",
      "unoPin-d-9" : "9",
      "unoPin-d-8" : "8",
      "unoPin-d-7" : "7",
      "unoPin-d-6" : "6",
      "unoPin-d-5" : "5",
      "unoPin-d-4" : "4",
      "unoPin-d-3" : "3",
      "unoPin-d-2" : "2",
      "unoPin-d-1" : "1",
      "unoPin-d-0" : "0",
      "unoPin-p-unknow" : "unknow",
      "unoPin-p-ioref" : "ioref",
      "unoPin-p-reset" : "reset",
      "unoPin-p-3v3" : "3.3V",
      "unoPin-p-5v" : "5V",
      "unoPin-p-gnd1" : "gnd",
      "unoPin-p-gnd2" : "gnd",
      "unoPin-p-vin" : "vin",
      "unoPin-a-0" : "14",
      "unoPin-a-1" : "15",
      "unoPin-a-2" : "16",
      "unoPin-a-3" : "17",
      "unoPin-a-4" : "18",
      "unoPin-a-5" : "19"
    };
    return data[name] || name;
  };

  function getTransformObj(svgElement) {
    return {
      x: svgElement.transform.baseVal[0].matrix.e,
      y: svgElement.transform.baseVal[0].matrix.f
    };
  }

  function setTranslate(svgElement, x, y) {
    var elem = d3.select(svgElement);
    var transform = d3.zoomIdentity;
    transform = transform.translate(x, y);
    elem.attr('transform', transform);
  }

  ArduinoUno.prototype = proto = Object.create(ArduinoUno.prototype, {

  });

  proto.start = function () {
    var translate = getTransformObj(this._power.node());
    setTranslate(this._power.node(), this._PLAYING_X_DISTANCE, translate.y);
  };

  proto.stop = function () {
    var translate = getTransformObj(this._power.node());
    setTranslate(this._power.node(), 0, translate.y);
  }

  proto.online = function () {
    this._online.attr('opacity', 1);
  }

  proto.offline = function () {
    this._online.attr('opacity', 0);
  }

  proto.destroy = function () {
    this.offline();
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    ArduinoUno.template = g.outerHTML;
  });

  return ArduinoUno;
});