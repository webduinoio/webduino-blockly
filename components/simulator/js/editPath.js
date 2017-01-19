+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.EditPath = factory();
  }
})(this, function() {

  function EditPath(config) {
    this._editContent = d3.select(config.area);
    this._pathId = config.pathId;
    this._init = init.bind(this);
    this._addEditedCircles = addEditedCircles.bind(this);
    this._d3Drag = d3Drag.bind(this);
    this._movePointStartFn = config.movePointStart || function () {};
    this._movePointEndFn = config.movePointEnd || function () {};

    this._init();
  }

  function init() {
    if (!this._pathId) {
      this._editContent.classed('editing', false);
      return;
    }

    var data = [];
    var pathDatas = utils.getPathsData();
    var pathData = pathDatas[this._pathId];

    pathData.forEach(function (val, idx) {
      data.push(val[1]);
    });
    data.unshift(pathData[0][0]);

    this._addEditedCircles(data);
    this._editContent.classed('editing', true);
  }

  /**
   * 添加編輯 path 時的圓點
   * @param {array} data - 多個圓點的座標
   */
  function addEditedCircles(data) {
    var circle = this._editContent.selectAll('circle').data(data);

    circle.exit().remove();
    circle.enter()
      .append('circle')
      .merge(circle)
      .on('.drag', null)
      .classed('locking', false)
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .call(this._d3Drag());
  }

  /**
   * 編輯路徑上，圓點的拖拉行為 
   * 限制：頭和尾不會是同一點
   * @return {d3.drag} d3 drag function
   */
  function d3Drag() {
    var self = this;
    var copyPathData;
    var initEditedCircle;
    var isSidePoint;

    return d3.drag()
      .on('start', start)
      .on('drag', drag)
      .on('end', end);

    function start(d, i) {
      self._movePointStartFn();
      var pathDatas = utils.getPathsData();
      
      copyPathData = pathDatas[self._pathId];
      initEditedCircle = utils.clone(d);

      // 利用物件的特性，來處理。
      // i = 0，表示起點
      // n 條線，有 n + 1 個點，i = 1 時，表示第 1 條線結尾，也是第 2 條線的開始。
      // 頭尾的點另外處理
      if (i === 0) {
        copyPathData[i][0] = d;
        isSidePoint = true;
      } else if (i === copyPathData.length) {
        copyPathData[i - 1][1] = d;
        isSidePoint = true;
      } else {
        copyPathData[i][0] = d;
        copyPathData[i - 1][1] = d;
      }

      d3.select(this.parentNode).selectAll('circle').classed('locking', false);
      d3.select(this).classed('locking', true);
    }

    function drag(d, i) {
      d.x = d3.event.x;
      d.y = d3.event.y;
      d3.select(this).attr("cx", d.x).attr("cy", d.y);
      pathUpdate(self._pathId, copyPathData);
    }

    function end(d, i) {
      var connectPoint = utils.getConnectPoint(event.target);
      var point, aa, bb;
      
      if (connectPoint) {
        // connectPoint 是不同座標系統的點，所以需要經過轉換。
        if (_zoomInst) {
          $.extend(connectPoint, _zoomInst.invert(connectPoint));
        }
        $.extend(d, connectPoint);
      }

      // 檢查：頭、尾不可是同一點
      if (isSidePoint) {
        if (connectPoint) {
          if (i === 0) {
            point = copyPathData[copyPathData.length - 1][1];
          } else {
            point = copyPathData[0][0];
          }
          aa = point.component;
          bb = connectPoint.component;
          if (aa.id === bb.id && aa.pin === bb.pin) {
            $.extend(d, initEditedCircle);
          }
        } else {
          $.extend(d, initEditedCircle);
        }
      }

      d3.select(this).attr("cx", d.x).attr("cy", d.y);
      pathUpdate(self._pathId, copyPathData);

      isSidePoint = null;
      copyPathData = null;
      self._movePointEndFn();
    }

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
  
  return EditPath;
});
