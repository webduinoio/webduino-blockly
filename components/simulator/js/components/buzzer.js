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

  var FILE_NAME = 'media/svg/buzzer.svg';
  var proto;

  function Buzzer(id) {
    this._id = id;
    this._elem = d3.select('#' + id);
  }

  Buzzer.type = 'Buzzer';

  Buzzer.label = 'Buzzer';

  Buzzer.icon = 'media/icon/preview-buzzer.png';

  /**
   * 在送給 engine 的資料格式，經過 parserPin 之後的介入點
   * @param  {object} setting - 元件本身送給 engine 的格式
   * @param  {array}  all     - 所有元件送給 engine 的格式檔
   * @return {object} 調整後的內容
   */
  Buzzer.afterParserPin = function (setting, all) {
    var pin1 = setting.pin1;
    var pin2 = setting.pin2;

    delete setting.pin1;
    delete setting.pin2;

    if (pin1) {
      if (pin1 === 'gnd') setting.gnd = pin1;
      else setting.signal = pin1;
    }

    if (pin2) {
      if (pin2 === 'gnd') setting.gnd = pin2;
      else setting.signal = pin2;
    }

    return setting;
  };

  Buzzer.prototype = proto = Object.create(Buzzer.prototype, {

  });

  proto.destroy = function () {
    
  };

  d3.xml(FILE_NAME).mimeType("image/svg+xml").get(function(error, xml) {
    if (error) throw error;
    var g = document.createElementNS(d3.namespaces.svg, 'g');
    g.innerHTML = xml.documentElement.innerHTML;
    d3.select(g).selectAll('[id]').attr('id', null);
    Buzzer.template = g.outerHTML;
  });

  return Buzzer;
});