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
  
  var FILE_NAME = 'media/svg/ultrasonic.svg';
  var proto;

  function UltraSonic(id, engine, trig, echo, isAutoAddTarget) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._engine = engine;
    this._trig = trig;
    this._echo = echo;
    this._target = null;
    this._hand = null; // 自動建立的手的元件
    this._handEl = null;
    this._DEFAULT_DISTANCE = 30;

    addEvent.apply(this);
    addHand.apply(this);
  }

  function addEvent() {
    var self = this;

    this._engine.board.on(webduino.BoardEvent.SYSEX_MESSAGE, function(data) {
      data = data.message;

      // data[1]: Trigger , data[2]: Echo
      if (data[0] == 1 /*UltraSonic*/ && data[1] == self._trig && data[2] == self._echo) {
        self._engine.board.sendSysex(1, getReturnInfo.apply(self));
      }
    });

  }

  function addHand() {
    var hand = utils.createComponent('Hand');
    var coor = utils.getCenter(this._elem.node());
    var d3HandBody = d3.select(hand).select('[name="body"]');
    var zoomContainer = d3.select(utils.config.zoomContainer).node();
    
    coor = utils.coordinateTransform(zoomContainer, coor);
    d3HandBody.attr('opacity', 0);
    zoomContainer.appendChild(hand);

    var bbox = hand.getBBox();
    coor.x -= (bbox.width / 2);
    coor.y -= (bbox.height / 2);
    utils.translate(hand, coor.x, coor.y);
    d3HandBody.attr('opacity', 0.3);

    this._hand = new _components.Hand(hand.id, utils.config.zoomContainer);
    this._handEl = hand;
  }

  function getReturnInfo() {
    var distance = this._hand.getValue();
    var data = [this._trig, this._echo];
    var str = "" + distance;
    for (var i = 0; i < str.length; i++) {
      data.push(str.charCodeAt(i));
    }
    return data;
  }

  UltraSonic.type = 'UltraSonic';

  UltraSonic.labelKey = 'components.ultraSonic.label';

  UltraSonic.icon = 'media/icon/preview-ultrasonic.png';

  UltraSonic.i18n = {
    "en": {
      "components.ultraSonic.label": "Ultra Sonic"
    },
    "zh-tw": {
      "components.ultraSonic.label": "超音波"
    },
    "zh-cn": {
      "components.ultraSonic.label": "超音波"
    }
  };

  UltraSonic.prototype = proto = Object.create(UltraSonic.prototype, {

  });

  proto.destroy = function () {
    this._hand.destroy();
    d3.select(this._handEl).remove();
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    UltraSonic.template = g.outerHTML;
  });

  return UltraSonic;
});