+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.Zoom = factory();
  }
})(this, function() {

  function Zoom(selector, trasnformTarget) {
    
    trasnformTarget = trasnformTarget || selector;
    
    var zoomElem = d3.select(selector);
    var transformElem = d3.select(trasnformTarget);
    var zoomed = function () {
      console.log('zoom', d3.event.transform);
      transformElem.attr("transform", d3.event.transform);
    };
    var zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .filter(function () {
        return event.type === 'wheel' || !$(event.target).parents('.component').length;
      })
      .on('zoom', zoomed);

    zoomElem.call(zoom)
      .on("wheel", function() { d3.event.preventDefault(); });

    this.zoomElem = zoomElem;
    this.transformElem = transformElem;
    this.zoom = zoom;
  }

  var proto = Zoom.prototype;

  proto.transform = function () {
    return d3.zoomTransform(this.zoomElem.node());
  };

  proto.invert = function (point) {
    var inv = this.transform().invert([point.x, point.y]);
    return {
      x: inv[0],
      y: inv[1]
    };
  };

  proto.apply = function (point) {
    var inv = this.transform().apply([point.x, point.y]);
    return {
      x: inv[0],
      y: inv[1]
    };
  };

  proto.zoomToFit = function () {
    this.zoomElem.call(this.zoom.transform, d3.zoomIdentity);
  }

  // proto.apply = function (point) {
  //   var inv = this.transform().apply([point.x, point.y]);
  //   return {
  //     x: inv[0],
  //     y: inv[1]
  //   };
  // };
  
  return Zoom;
});
