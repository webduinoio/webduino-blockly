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

  var FILE_NAME = 'media/svg/servo.svg';
  var proto;

  function Servo(id) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._angle = 0;
    this._minAngle = 0;
    this._maxAngle = 180;
    this._degUseMs = 10;
  }

  Servo.type = 'Servo';

  Servo.label = 'Servo';

  Servo.icon = 'media/icon/preview-servo.png';

  Servo.prototype = proto = Object.create(Servo.prototype, {

    angle: {
      get: function () {
        return this._angle;
      },
      set: function (val) {
        val = parseFloat(val);
        var duration = Math.abs(this._angle - val) * this._degUseMs;
        this._angle = val;
        this._elem.select('[name="servoBorn"]')
          .style('transform-origin', 'center center')
          .transition().duration(duration)
          .style('transform', 'rotate(' + val +'deg)');
      }
    }

  });

  proto.destroy = function () {};

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    Servo.template = g.outerHTML;
  });

  return Servo;
});