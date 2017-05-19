+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.ConnectPoint = factory();
  }
})(this, function() {
  "use strict";
  
  function ConnectPoint() {
    this._componentsArea = d3.select('#editArea .components-area');
    this._quadtree = d3.quadtree();
  }

  ConnectPoint.prototype.update = function () {
    var data = [];
    this.clear();
    this._componentsArea.selectAll('[name="pinGroup"] > rect').each(function (p, j) {
      // 點的座標系統是 .zoom-container
      var point = utils.getConnectPoint(this, '.zoom-container');
      point.elem = this;
      data.push([point.x, point.y, point]);
    });
    this._quadtree.addAll(data);
    this._data = data;
  };

  ConnectPoint.prototype.clear = function () {
    this._quadtree.removeAll(this._data || []);
    this._data = null;
  };

  ConnectPoint.prototype.find = function (x, y, radius) {
    radius = radius || null;
    return this._quadtree.find(x, y, radius);
  };

  ConnectPoint.prototype.destroy = function () {
    this.clear();
    this._componentsArea = null;
    this._quadtree = null;
  };
  
  return ConnectPoint;
});
