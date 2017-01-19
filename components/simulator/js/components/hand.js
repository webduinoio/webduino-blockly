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

  var FILE_NAME = 'media/svg/hand.svg';
  var proto;

  function Hand(id, container) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._container = container && d3.select(container);

    addEvent.apply(this);
  }

  function addEvent() {
    var self = this;
    var container = this._container.length && this._container.node();
    var d3Drag = d3.drag()
      .container(function () {
        return container ? container : this.parentNode;
      })
      .on('start', function () {
        var parent = self._elem.node().parentNode;
        d3.select(parent).append(function () {
          return self._elem.remove().node();
        });
      })
      .on('drag', function () {
        var cur = utils.getTransformObj(this);
        cur.x += d3.event.dx;
        cur.y += d3.event.dy;
        var translate = d3.zoomIdentity.translate(cur.x, cur.y);
        self._elem.attr('transform', translate);
      });

    this._elem.call(d3Drag);
  }

  Hand.type = 'Hand';

  Hand.label = 'Hand';

  Hand.icon = 'media/icon/preview-hand.png';

  Hand.notInContainer = true;

  Hand.prototype = proto = Object.create(Hand.prototype, {

  });

  proto.destroy = function () {
    this._elem.on('.drag', null);
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    Hand.template = g.outerHTML;
  });

  return Hand;
});