+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.Zoom = factory();
  }
})(this, function() {
  "use strict";
  
  function Zoom(option) {
        
    var selector = option.selector;
    var trasnformTarget = option.trasnformTarget;
    var zoomElem = d3.select(selector);
    var transformElem = d3.select(trasnformTarget);
    var zoomed = function () {
      // console.log('zoom', d3.event.transform);
      transformElem.attr("transform", d3.event.transform);
    };
    var afterZoom = function() {
      // console.log('afterZoom');
      option.afterZoom();
    };
    var zoom = d3.zoom()
      .scaleExtent([0.3, 5])
      .filter(function () {
        return d3.event.type === 'wheel' || !$(d3.event.target).parents('.component').length;
      })
      .on('zoom', zoomed)
      .on('end', afterZoom);

    zoomElem.call(zoom).on("wheel", function() { d3.event.preventDefault(); });

    this.zoomElem = zoomElem;
    this.transformElem = transformElem;
    this.zoom = zoom;
  }

  var proto = Zoom.prototype;

  proto.invert = function (point) {
    var inv = this.getTransform().invert([point.x, point.y]);
    return {
      x: inv[0],
      y: inv[1]
    };
  };

  // proto.apply = function (point) {
  //   var inv = this.getTransform().apply([point.x, point.y]);
  //   return {
  //     x: inv[0],
  //     y: inv[1]
  //   };
  // };

  proto.zoomToFit = function () {
    this.setTransform(d3.zoomIdentity, true);
  };

  proto.getTransform = function () {
    return d3.zoomTransform(this.zoomElem.node());
  };

  proto.setTransform = function (obj, silence) {
    var t = d3.zoomIdentity.translate(obj.x, obj.y).scale(obj.k);

    silence = !!silence;

    if (silence) {
      // 不觸發事件的更新方式
      this.transformElem.attr("transform", t);
      this.zoomElem.property('__zoom', t);
    } else {
      this.zoomElem.call(this.zoom.transform, t);
    }
    
  };
  
  return Zoom;
});
