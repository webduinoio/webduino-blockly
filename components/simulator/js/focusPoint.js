+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.FocusPoint = factory();
  }
})(this, function() {
  "use strict";
  
  function FocusPoint(config) {
    this._container = d3.select(config.container);
    this._focus = this._container.append('g')
      .classed('focusPoint hidden', true);

    this._focus.append('rect')
      .attr('fill', '#FF0000')
      .attr('stroke', '#000')
      .attr('width', 8)
      .attr('height', 8)
      .classed('zzzzz', true);
  }

  var proto = FocusPoint.prototype;

  proto.focus = function (coordinate) {
    if (!coordinate) {
      return false;
    }

    var transform = d3.zoomIdentity;
    transform = transform.translate(coordinate.x, coordinate.y);
    this._focus.attr('transform', transform);
    this._focus.classed('hidden', false);
  };

  proto.blur = function () {
    this._focus.classed('hidden', true);
  };
  
  return FocusPoint;
});
