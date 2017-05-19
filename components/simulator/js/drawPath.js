+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.DrawPath = factory();
  }
})(this, function() {
  "use strict";
  
  function DrawPath(config) {
    this._target = d3.select(config.target);
    this._dragContainer = d3.select(config.dragContainer);
    this._pathContainer = d3.select(config.pathContainer);
    this._startPoint = null;
    this._endPoint = null;
    this._pathNode = null;
    this._gNode = null;
    this._line = null;
    this._path = [];
    this._start = startHandler.bind(this);
    this._drag = dragHandler.bind(this);
    this._end = endHandler.bind(this);
    this._updatePath = updatePath.bind(this);
    this._drawStartFn = config.drawStart || function () {};
    this._drawDragFn = config.drawDrag || function () {};
    this._drawEndFn = config.drawEnd || function () {};
    this._pointsMgr = new ConnectPoint();;
    this._config = config;

    this._target.call(d3Drag(this));
  }

  function d3Drag(self) {
    var container = self._dragContainer;
    var inst = d3.drag()
      .on('start', self._start)
      .on('drag', self._drag)
      .on('end', self._end)
      .container(function() {
        return container ? container.node() : this.parentNode;
      })
      .filter(function () {
        var $elem = $(d3.event.target);
        var bol = $elem.is('rect') && $elem.parents('[name="pinGroup"]').length > 0;
        return bol;
      });

    return inst;
  }

  function startHandler() {
    this._pointsMgr.update();
    this._startPoint = this._pointsMgr.find(d3.event.x, d3.event.y, 20)[2];
    this._line = [this._startPoint, this._startPoint];
    this._path.push(this._line);
    this._gNode = this._pathContainer.append('g').attr('id', utils.guid()).node();
    this._pathNode = utils.createPath(this._path);
    this._gNode.appendChild(this._pathNode);
    this._drawStartFn();
  }

  function dragHandler() {
    d3.event.sourceEvent.preventDefault();

    // 這點的坐標系統是 _dragContainer，不是 screen
    var point = {
      x: d3.event.x,
      y: d3.event.y
    };
    var target = getEventTarget();
    var cloestPoint = this._pointsMgr.find(point.x, point.y, 20);
    
    if (cloestPoint) {
      // 取得 connectPoint 中，點的資訊
      cloestPoint = cloestPoint[2];
      target = cloestPoint.elem;
    }

    // 最接近的點，不能是起點
    if (cloestPoint === this._startPoint) {
      cloestPoint = null;
      target = null;
    }
    
    this._updatePath(point);
    this._endPoint = cloestPoint;
    this._drawDragFn(target);
  }

  function endHandler() {
    var pathId = null;
    var shadowNode;

    if (!this._endPoint) {
      d3.select(this._gNode).remove();
    } else {
      // 修正結束的點座標
      this._updatePath(this._endPoint);

      // add shadow element
      shadowNode = utils.createPath(this._path);
      d3.select(shadowNode).classed('shadow', true);
      this._gNode.appendChild(shadowNode);

      // edit mode
      pathId = d3.select(this._gNode).attr('id');
    }

    this._startPoint = null;
    this._endPoint = null;
    this._pathNode = null;
    this._gNode = null;
    this._line = null;
    this._path = [];
    this._pointsMgr.clear();
    this._drawEndFn(pathId);
  }

  function updatePath(point) {
    this._line.pop();
    this._line.push(point);
    utils.updatePath(this._pathNode, this._path);
  }

  function getEventTarget() {
    if (d3.event.identifier === 'mouse') {
      return d3.event.sourceEvent.target;
    } else {
      touch = d3.event.sourceEvent.targetTouches[0];
      return document.elementFromPoint(touch.clientX, touch.clientY);
    }
  }

  DrawPath.prototype.destroy = function () {
    this._target.on('.drag', null);
    this._pointsMgr.destroy();
  };
  
  return DrawPath;
});
