+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.utils= factory();
  }
})(this, function() {
  "use strict";
  
  var moment = window.moment;

  var lineFn = d3.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });

  var config = {
    componentArea: '.components-area',
    zoomContainer: '.zoom-container'
  };

  /**
   * 將多組座標資料，合併為一條 path 資料
   * @example
   * var rt = joinedPath(multiPaths)
   * // multiPaths = [[{"x":0,"y":0},{"x":10,"y":15}],[{"x":10,"y":15},{"x":20,"y":30}]]
   * // rt = [{"x":0,"y":0},{"x":10,"y":15},{"x":20,"y":30}]
   * @param  {array} multiPaths - 多組座標資料
   * @return {array} 合併後的 path 資料
   */
  function joinedPath(multiPaths) {
    var data;
    multiPaths.forEach(function(val, idx) {
      if (idx === 0) {
        data = val.slice();
      } else {
        data.push(val[1]);
      }
    });
    return data;
  }

  /**
   * id 產生
   * @return {string} id
   */
  function guid() {
    var time = moment ? moment().format('YYYYMMDD') + '-' : '';

    return 'id_' + time + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();

    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
  }

  /**
   * 使用 JSON 的方法，來做資料的複製
   * @param  {object|array} data - 被複製的資料
   * @return {object|array} 複製的資料
   */
  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * 取得 transform 裡的 translate 的值
   * @param  {object} svgElement - svg element
   * @return {object} {x, y}
   */
  function getTransformObj(svgElement) {
    return {
      x: svgElement.transform.baseVal[0].matrix.e,
      y: svgElement.transform.baseVal[0].matrix.f
    };
  }

  /**
   * 轉換座標，由 svg 座標系統到在指定容器元素座標系統
   * @param  {SVGElement} container   - 指定元素
   * @param  {object}     coord       - x, y
   * @return {object} x, y
   */
  function coordinateTransform(container, coord) {
    var viewportEl = container.nearestViewportElement;
    var ctm = container.getCTM();
    var point = viewportEl.createSVGPoint();
    
    point.x = coord.x;
    point.y = coord.y;

    var newCoord = point.matrixTransform(ctm.inverse());
    return {
      x: newCoord.x,
      y: newCoord.y
    };
  }

  /**
   * 取得目標元素在 svg (viewport) 的座標
   * @param  {SVGElement} svgElement - svg element
   * @return {object} {x, y}
   */
  function getViewportCoordinate(svgElement) {
    var viewportEl = svgElement.nearestViewportElement;
    var currCoord = svgElement.getBBox();
    var coor = {x: 0, y: 0};
    var ctm, point;
    if (viewportEl) {
      ctm = svgElement.getCTM();
      point = viewportEl.createSVGPoint();
      point.x = currCoord.x;
      point.y = currCoord.y;
      coor = point.matrixTransform(ctm);
    }
    return {
      x: coor.x,
      y: coor.y
    };
  }

  /**
   * 取得矩形中心點
   * @param  {SVGElement} svgElement - svg rectangle element
   * @return {object} {x, y}
   */
  function getRectCenter(svgElement) {
    var bound = svgElement.getBoundingClientRect();
    var coor = getViewportCoordinate(svgElement);
    return {
      x: coor.x + bound.width/2,
      y: coor.y + bound.height/2
    }
  }

  /**
   * 取得元素的中心座標
   * @param  {SVGElement} svgElement - svg element
   * @param  {string} containerSelector  - container，指定座標系統，預設為 screen
   * @return {object} {x, y}
   */
  function getCenter(svgElement, containerSelector) {
    var centerPoint = getRectCenter(svgElement);
    var elem;

    if (containerSelector) {
      elem = document.querySelector(containerSelector);
      return coordinateTransform(elem, centerPoint);
    }

    return centerPoint;
  }
  
  /**
   * 匯出元件布局 JSON
   * @return {object} JSON Object
   */
  function exportLayout() {
    var comps = d3.selectAll('svg .components-area .component');
    var paths = d3.selectAll('svg .path-container path:not(.shadow)');

    var svg = d3.select('svg').node();
    var rect = svg.getBoundingClientRect();

    var layout = {
      "name": "svg",
      "width": rect.width,
      "height": rect.height,
      "zoom": _zoomInst.getTransform(),
      "data": {
        "components": clone(comps.data()),
        "paths": clone(paths.data())
      }
    };

    return layout;
  }

  /**
   * 匯入元件布局 JSON
   * @param  {object} jsonObj - 元件布局 JSON
   */
  function importLayout(jsonObj) {
    var area = d3.select('svg .components-area');
    var pathContainer = d3.select('svg .path-container');
    var editContent = d3.select('svg .edit-content');

    // clear content
    area.selectAll('*').remove();
    pathContainer.selectAll('*').remove();
    editContent.selectAll('*').remove();

    // 比例尺的部份
    // 相容之前釋出的 blockly 版本
    if (jsonObj.zoom) {
      _zoomInst.setTransform(jsonObj.zoom, true);
    }
    
    // 匯入資料
    // 待處理
    
    // components
    $.each(jsonObj.data.components, function(idx, val) {
      var elem = createComponent(val);
      area.node().appendChild(elem);
    });

    // paths
    $.each(jsonObj.data.paths, function(idx, val) {
      var g = createSVGElement('g');
      var path = createPath(val);
      var shadowPath = createPath(val);
      d3.select(shadowPath).classed('shadow', true);
      g.appendChild(path);
      g.appendChild(shadowPath);
      d3.select(g).attr('id', guid());
      pathContainer.node().appendChild(g);
    });
  }

  function createSVGElement(name) {
    return document.createElementNS(d3.namespaces.svg, name);
  }

  /**
   * 產生元件元素
   * @param  {object|string} info - ex: {type: 'fly', x: 11, y: 22}
   * @return {element} svg element
   */
  function createComponent(info) {
    if (typeof info === 'string') {
      info = { type: info }; 
    }
    info.id = info.id || guid();

    var type = info.type;
    var dataInfo = _components[type];
    var parse = function(str) {
      var el = Snap.parse(str);
      el = el.select('g');
      return el.node;
    };
    var elem = parse(dataInfo.template);
    var d3Elem = d3.select(elem)
      .data([info])
      .attr('id', function(d) { return d.id; })
      .attr('data-type', type)
      .classed('component', true);

    if (info.x || info.y) {
      translate(elem, info.x, info.y);
    }
    return  d3Elem.node();
  }

  /**
   * 更新元件的位置資訊
   * @param  {element} element - svg element
   */
  function updateLocationData(element) {
    var bbox = Snap(element).getBBox();
    var el = d3.select(element);
    var data = el.data()[0];
    data.x = bbox.x;
    data.y = bbox.y;
    el.datum(data);
  }

  /**
   * 在 svg 更新元素的 translate
   * @param  {element} target   - svg element
   * @param  {string|number} x  - x 座標
   * @param  {string|number} y  - y 座標
   */
  function translate(target, x, y) {
    var transform = d3.zoomIdentity;
    transform = transform.translate(x, y);
    d3.select(target).attr('transform', transform);
  }

  /**
   * 產生 path 元素
   * @param  {array} data - 多條 path 資料，ex: [[{x: 10, y: 10}, {x: 20, y: 20}], [{x: 20, y: 20}, {x: 30, y: 30}]]
   * @return {element} svg element
   */
  function createPath(data) {
    var elem = d3.select(createSVGElement('path'));
    elem.data([data]).attr("d", function(d) { 
      var dd = joinedPath(d);
      return window.pathRoundedCorner(lineFn(dd)); 
    });
    return elem.node();
  }

  /**
   * 更新 path 元素的 data
   * @param  {element} elem - svg element
   * @param  {object} data - 多條 path 資料
   */
  function updatePath(elem, data) {
    d3.select(elem).data([data]).attr("d", function(d) { 
      var dd = joinedPath(d);
      return window.pathRoundedCorner(lineFn(dd)); 
    });
  }

  /**
   * 更新畫面上的 path 圖形
   * @param  {element} elem - path element
   */
  function redrawPath(elem) {
    d3.select(elem).attr("d", function(d) {
      var dd = joinedPath(d);
      return window.pathRoundedCorner(lineFn(dd)); 
    });
  }

  /**
   * 取得所有 path 資料
   * @example
   * var aa = getPathsData();
   * // aa = { "group id" : [[{x: 10, y: 10}, {x: 20, y: 20}], [{x: 20, y: 20},{x: 30, y: 30}]], ...}
   * @param  {Boolean} isReallyData - 是否是真實資料
   * @return {object} 所有路徑資料
   */
  function getPathsData(isReallyData) {
    var obj = {};
    var pathContainers = d3.select('.path-container');
    
    pathContainers.selectAll('g').each(function() {
      obj[this.id] = d3.select(this).select('path:not(.shadow)').data()[0];
    });
    return !!isReallyData ? obj : clone(obj);
  }

  /**
   * 取得目標元件的 pin 腳資料
   * @param  {string|element} selector - 目標元素
   * @return {object} pin 腳資料, {x, y, pin}
   */
  // function getPinsData(selector) {
  //   var target = d3.select(selector);
  //   var pinData = [];

  //   target.select('[name="pinGroup"]').selectAll('rect').each(function() {
  //     var rect = getRectCenter(this);
  //     rect.pin = this.getAttribute('name');
  //     pinData.push(rect);
  //   });

  //   return pinData;
  // }

  /**
   * 取得目標元素所對應的連接點座標
   * @param  {element} elem - html element
   * @param  {string} containerSelector  - container，指定座標系統，預設為 screen
   * @return {object} 回傳座標資訊, ex: {x: 1, y: 1, component: {id: 'xxx', type: 'led', pin: 'xxx'}}
   */
  function getConnectPoint(elem, containerSelector) {
    var $elem = $(elem);
    var $com = $elem.parents('.component').first();
    var coor;

    if (!$elem.parents('[name="pinGroup"]').length) {
      return null;
    }

    if ($elem.is('rect')) {
      coor = getCenter(elem, containerSelector);
      coor.component = {
        id: $com.attr('id'),
        type: $com.get(0).dataset.type,
        pin: $elem.attr('name')
      };
      return coor;
    }

    return null;
  }

  function on(type, handler) {
    $('body').on(type, function (event, data) {
      handler(data);
    });
  }

  function once(type, handler) {
    $('body').once(type, function (event, data) {
      handler(data);
    });
  }

  function off(type) {
    $('body').off(type);
  }

  function trigger(type, data) {
    var sendData = [];

    if (data) {
      sendData.push(data);
    }

    $('body').trigger(type, sendData);
  }

  return {
    config: config,
    guid: guid,
    getTransformObj: getTransformObj,
    getViewportCoordinate: getViewportCoordinate,
    // getRectCenter: getRectCenter,
    getCenter: getCenter,
    clone: clone,
    exportLayout: exportLayout,
    importLayout: importLayout,
    createSVGElement: createSVGElement,
    createComponent: createComponent,
    updateLocationData: updateLocationData,
    translate: translate,
    getPathsData: getPathsData,
    createPath: createPath,
    updatePath: updatePath,
    redrawPath: redrawPath,
    getConnectPoint: getConnectPoint,
    coordinateTransform: coordinateTransform,
    event: {
      on: on,
      once: once,
      off: off,
      trigger: trigger
    }
  };
});