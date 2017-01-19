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

  var FILE_NAME = 'media/svg/rgbled.svg';
  var proto;

  function RGBLed(id) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._rgbledColor = this._elem.select('[name="rgbledColor"]');
    this._color = {
      red: 0,
      green: 0,
      blue: 0
    };
  }

  RGBLed.type = 'RGBLed';

  RGBLed.label = 'RGBLed';

  RGBLed.icon = 'media/icon/preview-rgbled.png';

  RGBLed.parserPin = function(name) {
    var data = {
      "r": "signalRed",
      "g": "signalGreen",
      "b": "signalBlue"
    };
    return data[name] || name;
  };

  function calcuColor(colorInfo) {
    var color = "#";
    var sort = ['red', 'green', 'blue'];

    sort.forEach(function (key) {
      var val = Math.round(colorInfo[key] * 255);
      val = val.toString(16);
      val = val.length === 1 ? ('0' + val) : val;
      color += val.toString(16);
    });
    return color;
  }

  function calcuOpacity(colorInfo) {
    var opacity = 0;
    Object.keys(colorInfo).forEach(function (val) {
      opacity += colorInfo[val];
    });
    return Math.round(opacity * 100 / 3) / 100;
  }

  RGBLed.prototype = proto = Object.create(RGBLed.prototype, {

  });

  proto.rgb = function (obj) {
    // intensity 的值，跟電路接線有關，這裡剛好與一般認知的值相反
    // Engine 未處理 RGBLed 共陽/共陰，而預設為共陽
    // 元件圖示是共陽極的元件。
    this._color[obj.color] = 1 - obj.intensity;
    
    var _color = this._color;
    var opacity = calcuOpacity(_color);
    var colorVal = calcuColor(_color);

    this._rgbledColor.attr('opacity', opacity);
    this._rgbledColor.selectAll('path').attr('fill', colorVal);
  };

  proto.destroy = function () {
    this.rgb({ color: 'red', intensity: 1 });
    this.rgb({ color: 'green', intensity: 1 });
    this.rgb({ color: 'blue', intensity: 1 });
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    RGBLed.template = g.outerHTML;
  });

  return RGBLed;
});