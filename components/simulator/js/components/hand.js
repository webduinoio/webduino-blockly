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
    var bbox = self._elem.select('[name="group"]').node().getBBox();
    var width = bbox.width;
    var height = bbox.height;
    var scale = d3.scaleLinear()
      .domain([0, 200])
      .range([1, 3]);
    var zoom = d3.zoom()
      .scaleExtent([1, 3])
      .on('zoom', zoomed);

    zoomInput();
    self._elem.on('input', zoomInput);

    function zoomed() {
      self._elem.select('[name="group"]').attr("transform", d3.event.transform);
    }

    function zoomInput() {
      var val = self._elem.select('[name="input"]').node().value;
      self._elem.select('[name="value"]').html(val);
      transition(val);
    }

    function transition(val) {
      var k = scale(val);

      // 指定 zoom 的中心點的坐標，也能指定其他的點，來當做中心位置
      var center = [ width / 2, height / 2];

      var tf = d3.zoomTransform(self._elem.node());
      var tfn = transform(tf.x, tf.y, k);
      var translate0 = tf.invert(center);
      var l = tfn.apply(translate0);

      // 使用變化後的 scale，拿相同的位置(中心點坐標)來計算位移量，對原先的 x, y 做出修正。
      var dx = translate0[0] - l[0];
      var dy = translate0[1] - l[1];

      tfn = transform(tf.x + dx, tf.y + dy, k);
      self._elem.call(zoom.transform, tfn);
    }

    function transform(x, y, k) {
      return d3.zoomIdentity.translate(x, y).scale(k);
    }

  }

  Hand.type = 'Hand';

  Hand.labelKey = 'components.hand.label';

  Hand.icon = 'media/icon/preview-hand.png';

  Hand.notInContainer = true;

  Hand.i18n = {
    "en": {
      "components.hand.label": "Hand"
    },
    "zh-tw": {
      "components.hand.label": "手"
    },
    "zh-cn": {
      "components.hand.label": "手"
    }
  };

  Hand.prototype = proto = Object.create(Hand.prototype, {

  });

  proto.getValue = function () {
    return parseInt(this._elem.select('[name="input"]').node().value);
  };

  proto.destroy = function () {

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