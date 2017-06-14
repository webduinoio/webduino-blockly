+(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    modules.exports = factory();
  } else {
    global.interact = factory();
  }
})(this, function() {
  "use strict";
  
  var instance = [];

  function start() {
    console.log('interact start');
    var settings = getUISetting();
    settings = parserToEngine(settings);
    settings.forEach(function(val, idx, ary) {
      instance.push(createEngine(val));
    });
  }

  function stop() {
    console.log('stop');
    try {
      $.each(instance, function(idx, info) {

        // 清除元件 instance
        $.each(info.components, function (idx, comp) {
          comp.destroy && (comp.destroy());
        });
        
        info.uiBoard.stop();
        info.engine.stop();
      });
    } catch (e) {
      console.error(e);
    }
    instance = [];
  }

  function createEngine (uiSetting) {
    var engine = new Engine();
    var uiBoard = new _components.ArduinoUno(uiSetting.name);
    var components = {};

    components[uiSetting.name] = uiBoard;

    // engine 收到訊息後，會執行該方法
    engine.action(function (actionJSON) {
      
      console.log("engine callback:", actionJSON);

      var list = actionJSON.action.connector;
      var cf, comp, compId;
      
      for (var i in list) {
        console.log(list[i].type, list[i]);

        cf = list[i];
        compId = cf.name;
        comp = components[compId] || null;

        if (cf.type === 'Led') {
          comp = comp || new _components.Led(compId);
          comp.intensity = cf.intensity;
        } else if (cf.type === 'RGBLed') {
          comp = comp || new _components.RGBLed(compId);
          comp.rgb({
            color: cf.color,
            intensity: cf.intensity
          });
        } else if (cf.type === 'Servo') {
          comp = comp || new _components.Servo(compId);
          comp.angle = parseInt(cf.intensity * 255);
        } else if (cf.type === 'Matrix') {
          comp = comp || new _components[cf.type](compId);
          comp.print(cf.data);
        }
        
        if (comp && !components[compId]) {
          components[compId] = comp;
        }
      }
    });

    engine.start({
      create: uiSetting,
      disconnect: function () {
        uiBoard.offline();
      }
    }, function() {
      console.log("Board Ready...");
      uiBoard.online();

      var list = uiSetting.connector;
      var compId, compType, setting;

      for (var i in list) {
        setting = list[i];
        compId = setting.name;
        compType = setting.type;

        if (compType === 'Btn') {
          components[compId] = new _components.Btn(compId, engine, setting.signal);
        }

        if (compType === 'UltraSonic') {
          components[compId] = new _components.UltraSonic(compId, engine, setting.trig, setting.echo, true);
        }

      }
    });

    uiBoard.start();

    return {
      engine: engine,
      uiBoard: uiBoard,
      components: components
    };
  }

  /**
   * 取得送給 Engine 的元件配置檔
   * @return {object}
   */
  function getUISetting() {
    var paths = utils.getPathsData();
    var boards = {};
    var sensors = {};
    var links = [];
    var ArduinoUno = window._components.ArduinoUno;

    // 找出所有的 board
    $('svg').find('.components-area [data-type="ArduinoUno"]').each(function(idx, elem) {
      boards[elem.id] = {
        id: elem.id,
        deviceId: ArduinoUno.getProperty(elem.id, 'deviceId'),
        local: ArduinoUno.getProperty(elem.id, 'local') === 'true',
        type: elem.dataset.type,
        connector: []
      };
    });

    // 所有路徑的頭尾找出來
    $.each(paths, function(pathId, path) {
      var link = [];
      var firstPoint = path[0][0].component;
      var lastPoint = path[path.length - 1][1].component;
      link.push(firstPoint, lastPoint);
      links.push(link);
    });


    $.each(links, function(idx, info) {
      var p1, p2, config;

      if (info[0].type !== 'ArduinoUno') {
        p1 = info[0];
        p2 = info[1];
      } else {
        p1 = info[1];
        p2 = info[0];
      }

      config = getComponentConfig(p1, p2);
      sensors[p1.id] = sensors[p1.id] || {};
      $.extend(sensors[p1.id], config);
    });

    $.each(sensors, function(id, info) {
      var boardId = checkWhichBoard(info);
      boardId && boards[boardId].connector.push(info);
    });

    return boards;
  }

  /**
   * 合併開始/結束點的資料格式
   * @param  {object} startPoint - 開始點的資料
   * @param  {object} endPoint   - 結束點的資料
   * @return {object} 合併後的資料
   */
  function getComponentConfig(startPoint, endPoint) {
    var rt = {};
    rt.id = startPoint.id;
    rt.type = startPoint.type;
    rt[startPoint.pin] = {
      id: endPoint.id,
      type: endPoint.type,
      value: endPoint.pin
    };
    return rt;
  }

  /**
   * 檢查元件連接的板子 id
   * @param  {object} info - 元件資訊
   * @return {string} 板子的元素 id
   */
  function checkWhichBoard(info) {
    var boardId;
    switch (info.type) {
      case 'Led':
      case 'Servo':
      case 'Btn':
        if (info.signal.type === 'ArduinoUno') {
          boardId = info.signal.id;
        }
        break;
      case 'Matrix':
        if (info.din.type === 'ArduinoUno') {
          boardId = info.din.id;
        }
        break;
      case 'RGBLed':
        if (info.r.type === 'ArduinoUno') {
          boardId = info.r.id;
        }
        break;
      case 'Buzzer':
        if (info.pin1.type === 'ArduinoUno') {
          boardId = info.pin1.id;
        }

        if (info.pin2.type === 'ArduinoUno') {
          boardId = info.pin2.id;
        }
        break;
      case 'UltraSonic':
        if (info.trig.type === 'ArduinoUno') {
          boardId = info.trig.id;
        }
        break;
      default:
        break;
    }
    return boardId;
  }

  /**
   * 將 ui 畫面的資訊，轉換成元件配置 JSON
   * @param  {object} boards - ui 輸出的資訊，格式與最後結果相當，只是 key 值需要轉換
   * @return {object} 輸出給 js engine 的設定檔
   */
  function parserToEngine(boards) {
    var rt = [];
    $.each(boards, function(id, board) {

      // board 資訊
      var ss = {
        id: board.deviceId,
        name: id, // DOM element id
        type: "WebArduino",
        local: board.local,
        connector: []
      };
      var connector = board.connector;

      // 連接的元件
      $.each(connector, function(idx, sensor) {
        var rt = {};
        var sensorType = sensor.type;
        var nk;
        $.each(sensor, function(key, val) {
          switch (key) {
            case 'id':
              rt.name = val;
              break;
            case 'type':
              rt.type = val;
              break;
            default:
              nk = parserPin(sensorType, key);
              rt[nk] = parserPin(val.type, val.value);
              break;
          }
        });
        ss.connector.push(rt);
      });

      // afterParserPin 未考慮多塊板子的情況
      var settings = ss.connector;
      $.each(settings, function (idx, setting) {
        var type = setting.type;
        var cSetting = utils.clone(setting);
        var cSettings = utils.clone(settings);
        var cs = afterParserPin(type, cSetting, cSettings);
        settings[idx] = cs;
      });

      rt.push(ss);
    });
    return rt;
  }

  /**
   * 依元件的設定檔，找出對應的 pin value
   * @param  {string} type     - 元件種類
   * @param  {string} pinValue - dom 元素上，取得的 name 屬性的值
   * @return {string} 轉換成給 js engine 的值
   */
  function parserPin(type, pinValue) {
    var parser = _components[type] && _components[type].parserPin;
    var val = parser && parser(pinValue);
    return val || pinValue;
  }

  /**
   * 調整元件設定檔內容，因有些元件，需要在腳位內容確定後，才能確定腳位的值。
   * @param  {string} type             - 元件種類
   * @param  {object} componentSetting - 元件自身的設定檔
   * @param  {array}  settings         - 所有元件設定檔
   * @return {object} 修改後的元件設定檔
   */
  function afterParserPin(type, componentSetting, settings) {
    var parser = _components[type] && _components[type].afterParserPin;
    var val = parser && parser(componentSetting, settings);
    return val || componentSetting;
  }

  return {
    start: start,
    stop: stop,
    _setting: function () {
      var ui = getUISetting();
      var toE = parserToEngine(ui);
      console.log(ui, toE);
    }
  };
});
