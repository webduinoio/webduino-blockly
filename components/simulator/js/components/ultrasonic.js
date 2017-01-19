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

  var FILE_NAME = 'media/svg/ultrasonic.svg';
  var proto;

  function UltraSonic(id, engine, trig, echo, isAutoAddTarget) {
    this._id = id;
    this._elem = d3.select('#' + id);
    this._engine = engine;
    this._trig = trig;
    this._echo = echo;
    this._target = null;
    this._comp = null; // 自動建立的手的元件
    this._isAutoAddTarget = !!isAutoAddTarget;
    this._DEFAULT_DISTANCE = 30;

    addEvent.apply(this);

    if (this._isAutoAddTarget) {
      addTarget.apply(this);
    } 
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

  function addTarget() {
    var hand = utils.createComponent('Hand');
    var coor = utils.getCenter(this._elem.node());

    coor.x += 150;
    utils.translate(hand, coor.x, coor.y);
    this._elem.node().parentNode.appendChild(hand);
    this._comp = new _components.Hand(hand.id, utils.config.zoomContainer);
    this.setTarget(hand);
  }

  function getReturnInfo() {
    var distance = calcDistance.apply(this) || this._DEFAULT_DISTANCE;
    var data = [this._trig, this._echo];
    var str = "" + distance;
    for (var i = 0; i < str.length; i++) {
      data.push(str.charCodeAt(i));
    }
    return data;
  }

  function calcDistance() {
    if (!this._target) {
      return null;
    }

    var c1 = utils.getCenter(this._elem.node());
    var c2 = utils.getCenter(this._target.node());
    var dx_square = Math.pow(c1.x - c2.x, 2);
    var dy_square = Math.pow(c1.y - c2.y, 2);

    return Math.sqrt(dx_square + dy_square);
  }

  UltraSonic.type = 'UltraSonic';

  UltraSonic.label = 'UltraSonic';

  UltraSonic.icon = 'media/icon/preview-ultrasonic.png';

  UltraSonic.prototype = proto = Object.create(UltraSonic.prototype, {

  });

  proto.setTarget = function (target) {
    this._target = d3.select(target);
  };

  proto.destroy = function () {
    if (this._isAutoAddTarget) {
      this._comp.destroy();
      this._target.remove();
    }
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