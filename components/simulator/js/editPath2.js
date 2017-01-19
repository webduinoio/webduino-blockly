+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.EditPath2 = factory();
  }
})(this, function() {

  function EditPath2(config) {
    this._target = d3.select(config.target);
    this._dragContainer = d3.select(config.dragContainer);
    this._start = startHandler.bind(this);
    this._drag = dragHandler.bind(this);
    this._end = endHandler.bind(this);
    this._editEndFn = config.editEnd || function () {};
    this._path = null;
    this._pathId = null;
    this._startPoint = null;

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
        return event.target.nodeName.toLowerCase() === 'path';;
      });

    return inst;
  }

  function startHandler() {
    var target = d3.event.sourceEvent.target.parentNode;
    var point = { x: d3.event.x, y: d3.event.y };
    var path = utils.getPathsData()[target.id];
    var idx = getLineIdx(path, point);
    var line = path[idx];
    
    path.splice(idx, 1, [line[0], point], [point, line[1]]);
    this._startPoint = point;
    this._path = path;
    this._pathId = target.id;
  }

  function dragHandler() {
    this._startPoint.x = d3.event.x;
    this._startPoint.y = d3.event.y;
    pathUpdate(this._pathId, this._path);
  }

  function endHandler() {
    this._editEndFn(this._pathId);
  }

  /**
   * path 是有由許多的 line 組成，該方法檢測目標點，是位於那條 line 中。
   * 使用點到直線的距離來判斷。
   * @param  {array} d      - path 的資料，內含多條 line
   * @param  {object} point - 目標點的座標
   * @return {number} 點位於 path 中的第幾條 line 中
   */
  function getLineIdx(d, point) {
    var rt = [];

    d.forEach(function (val, idx, ary) {
      var unit = getUnit(val[0], val[1]);
      var info = { idx: idx };
      if (unit === null) {
        info.dis = Math.abs(point.x - val[0].x);
      } else if (unit.m === 0) {
        info.dis = Math.abs(point.y - val[0].y);
      } else {
        info.dis = (Math.abs(unit.m * point.x + point.y + unit.b) / Math.sqrt(unit.m * unit.m + 1));
      }

      rt.push(info);
    });

    rt.sort(function (a, b) {
      return a.dis - b.dis;
    });
    return rt[0].idx;
  }

  /**
   * 計算斜率
   * @param  {object} p1
   * @param  {object} p2
   * @return {number} 斜率
   */
  function calcM(p1, p2) {
    var deltaX = p1.x - p2.x;
    var deltaY = p1.y - p2.y;

    if (deltaX  === 0) {
      return null;
    }
    return deltaY / deltaX;
  }

  /**
   * 二點求直線 mx + y + b = 0
   * @param  {object} p1
   * @param  {object} p2
   * @return {object} null | {m, b}
   */
  function getUnit(p1, p2) {
    var m = calcM(p1, p2);

    if (m === null) {
      return null;
    }

    // y 軸的值，是正負相反。
    m *= -1;

    return {
      m: m,
      b: -(p1.y + m * p1.x)
    };
  }

  /**
   * 更新 path，包含 shadow path
   * @param  {string} pathId - the id of path
   * @param  {array}  data - 多組座標資料
   */
  function pathUpdate(pathId, data) {
    var g = d3.select('#' + pathId);
    
    if (!g.size()) {
      return;
    }

    g.selectAll('path')
      .each(function(p, j) {
        utils.updatePath(this, data);
      });
  }

  EditPath2.prototype.destroy = function () {
    this._target.on('.drag', null);
  };
  
  return EditPath2;
});
