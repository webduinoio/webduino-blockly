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

  var FILE_NAME = 'media/svg/button.svg';
  var proto;

  function Button(id, engine, pin) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._engine = engine;
    this._pin = pin;

    addEvent.apply(this);
  }

  function addEvent() {
    var self = this;

    this._elem.on('mousedown touchstart', function () {
      d3.event.preventDefault();
      self._engine.board.sendDigitalData(self._pin, 1);
      self._elem.select('[name="btnUp"]').attr('opacity', 0);
    });

    this._elem.on('mouseup touchend', function () {
      d3.event.preventDefault();
      setTimeout(function() {
        self._engine.board.sendDigitalData(self._pin, 0);
        self._elem.select('[name="btnUp"]').attr('opacity', 1);
      }, 0);
    });

  }

  Button.type = 'Btn';

  Button.label = 'Button';

  Button.icon = 'media/icon/preview-button.png';

  Button.prototype = proto = Object.create(Button.prototype, {

  });

  proto.destroy = function () {
    this._engine = null;
    this._pin = null;
    this._elem.on('mousedown touchstart mouseup touchend', null);
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    Button.template = g.outerHTML;
  });

  return Button;
});