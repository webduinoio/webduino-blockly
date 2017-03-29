+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.DndComponent = factory();
  }
})(this, function() {
  "use strict";
  
  function DndComponent(config) {
    this._target = d3.select(config.target);
    this._dragContainer = d3.select(config.dragContainer);
    this._dragTarget = null;
    this._changedPathPoints = null;
    this._start = startHandler.bind(this);
    this._drag = dragHandler.bind(this);
    this._end = endHandler.bind(this);
    this._dragStartFn = config.dragStart || function () {};
    this._dragEndFn = config.dragEnd || function () {};
    this._dragging = false;

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
        
        // 待有屬性面板時，再考慮拿掉
        if (d3.event.target.nodeName.toLowerCase() === 'text') {
          return false;
        }

        var target = d3.event.target;
        var $target = $(target);
        var bol = !($target.is('rect') && $target.parents('[name="pinGroup"]').length > 0) 
          && ($target.hasClass('component') || $target.parents('.component').length > 0);

        return bol;
      });

    return inst;
  }

  function startHandler() {
    var target = d3.event.sourceEvent.target;
    var $target = $(target);

    this._dragTarget = $target.hasClass('component') ? target : $target.parents('.component').first().get(0);
    this._changedPathPoints = findPoints(this._dragTarget.id);
  }

  function dragHandler() {

    if (!this._dragging) {
      this._dragging = true;

      this._dragStartFn();

      // 移動元素到父元素裡的最上層
      d3.select(this._dragTarget).raise();

      // 拖拉效果
      d3.select(this._dragTarget).classed('dragging', true);
    }

    var cur = utils.getTransformObj(this._dragTarget);
    var dx = d3.event.dx;
    var dy = d3.event.dy;
    cur.x += dx;
    cur.y += dy;

    var translate = d3.zoomIdentity.translate(cur.x, cur.y);

    // 更新元件
    d3.select(this._dragTarget).attr('transform', translate);

    // 修改 path
    $.each(this._changedPathPoints, function(pathId, points) {
      
      // 更新座標
      $.each(points, function(idx, point) {
        point.x += dx;
        point.y += dy;
      });

      // 更新畫面
      var g = d3.select('#' + pathId);
      g.selectAll('path').each(function() {
        utils.redrawPath(this);
      });

    });

  }

  function endHandler() {

    if (this._dragging) {
      this._dragging = false;
      
      // 拖拉效果
      d3.select(this._dragTarget).classed('dragging', false);

      utils.updateLocationData(this._dragTarget);
      this._dragEndFn(this._dragTarget.id);
    }
    
    this._dragTarget = null;
    this._changedPathPoints = null;
  }

  /**
   * 找出 path 上有連線到元件的點
   * @param  {string} compId - 被拖拉元件的 ID
   * @return {object} 需要更新座標的連接點
   */
  function findPoints(compId) {
    var pathPoints = {};
    var pathDatas = utils.getPathsData(true);

    $.each(pathDatas, function(pathId, paths) {
      $.each(paths, function(idx, line) {
        $.each(line, function(i, obj) {
          if (obj.component && obj.component.id === compId) {
            pathPoints[pathId] || (pathPoints[pathId] = []);
            pathPoints[pathId].push(obj);
          }
        });
      });
    });

    return pathPoints;
  }

  DndComponent.prototype.destroy = function () {
    this._target.on('.drag', null);
  };
  
  return DndComponent;
});
