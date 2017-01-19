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

  var FILE_NAME = 'media/svg/matrix.svg';
  var proto;

  function Matrix(id) {
    this._id = id;
    this._elem = d3.select('#' + id);
  }

  Matrix.type = 'Matrix';

  Matrix.label = 'Matrix';

  Matrix.icon = 'media/icon/preview-matrix.png';

  Matrix.prototype = proto = Object.create(Matrix.prototype, {
    
  });

  proto.print = function (v) {
    v = v ? v : "0000000000000000";

    var v16 = [];
    var v2 = [];
    var vimg = [];
    var va = v.split('');
    var circleName;
    for (var n = 0; n < 8; n++) {
      v16[n] = va[n * 2] + va[n * 2 + 1];
    }
    for (var m = 0; m < 8; m++) {
      var qq = parseInt(v16[m], 16);
      v2[m] = qq.toString(2);
      if (v2[m].length < 8) {
        var ml = 8 - v2[m].length;
        for (var o = 0; o < ml; o++) {
          v2[m] = '0' + v2[m];
        }
      }
    }
    for (var n = 0; n < 8; n++) {
      vimg[n] = v2[n].split('');
      for (var m = 0; m < 8; m++) {
        circleName = ['max', n, 7 - m, '-1'].join('');
        this._elem.select('[name="' + circleName + '"]').attr('opacity', vimg[n][m]);
      }
    }
  };

  proto.destroy = function () {
    this.print('');
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    Matrix.template = g.outerHTML;
  });

  return Matrix;
});