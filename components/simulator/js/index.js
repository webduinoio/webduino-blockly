+(function () {
  "use strict";

  var svg = d3.select('svg');
  var editContent = svg.select('.edit-content');
  var pathContainer = svg.select('.path-container');

  /**
   * vue instance - app
   * @namespace app
   */
  var app = new Vue({
    el: '#app',
    data: {
      language: '', // 語系
      drawingPath: false, // 畫線狀態
      movingCircle: false, // 編輯時，移動圓點
      editPathId: '', // 目前在編輯狀態的 path
      selectId: '', // 目前 focus 的元件
      instance: [], // 保存使用的功能實例
      engineStarting: false // Engine 是否啟動中
    },
    methods: {
      save: function (inst) {
        this.instance.push(inst);
      }
    }
  });

  app.$watch('drawingPath', function (newVal, oldVal) {
    if (newVal) {
      svg.classed('drawingPath', true);
    } else {
      svg.classed('drawingPath', false);
    }
  });

  app.$watch('movingCircle', function (newVal, oldVal) {
    if (newVal) {
      svg.classed('movingCircle', true);
    } else {
      svg.classed('movingCircle', false);
    }
  });

  app.$watch('editPathId', function (newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }
    oldVal && pathContainer.select('#' + oldVal).classed('editing', false);
    newVal && pathContainer.select('#' + newVal).classed('editing', true);

    new EditPath({
      area: '.edit-content',
      pathId: this.editPathId,
      movePointStart: function () {
        app.movingCircle = true;
      },
      movePointEnd: function () {
        app.movingCircle = false;
        addHistory();
      }
    });

  });

  app.$watch('selectId', function (newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }

    var area = d3.select(utils.config.componentArea);
    oldVal && area.select('#' + oldVal).select('[name="selected"]').attr('opacity', 0);
    newVal && area.select('#' + newVal).select('[name="selected"]').attr('opacity', 1);
  });

  app.$watch('language', function (newVal, oldVal) {
    var $lang = $('#lang');

    if (oldVal.length > 0) {
      i18next.changeLanguage(newVal, function (err, t) {
        $('body').localize();
      });
    } else {
      // 第一次更新值
      $lang.selectpicker('refresh');
      $lang.selectpicker('val', this.language);
    }
  });

  window.app = app;


  // 點的聚焦顯示
  var fp = new FocusPoint({
    container: '.zoom-container'
  });

  // 縮放功能
  var zoomInst = new Zoom('svg', '.zoom-container');

  // 歷史管理
  var hm = new HistoryManager();

  addHistory();
  drawPath();
  dndComponent();
  editPath2();
  i18n();
  sinkEvent();


  /**
   * 畫線功能
   */
  function drawPath() {
    var inst = new DrawPath({
      target: '.components-area',
      dragContainer: '#editArea > .zoom-container',
      pathContainer: '.path-container',
      drawStart: function () {
        app.drawingPath = true;
        app.selectId = '';
        app.editPathId = '';
      },
      drawDrag: function (elem) {
        pointFocus(elem);
      },
      drawEnd: function (pathId) {
        fp.blur();
        app.drawingPath = false;
        if (pathId) {
          app.editPathId = pathId;
        }
        addHistory();
      }
    });
    app.save(inst);
  }

  /**
   * 拖拉元件區元件
   */
  function dndComponent() {
    var inst = new DndComponent({
      target: '.zoom-container',
      dragContainer: '#editArea > .zoom-container',
      dragStart: function () {
        app.editPathId = '';
        app.selectId = '';
      },
      dragEnd: function (targetId) {
        app.selectId = targetId;
        addHistory();
      }
    });
    app.save(inst);
  }

  /**
   * path 編輯
   */
  function editPath2() {
    var inst = new EditPath2({
      target: '.path-container',
      dragContainer: '#editArea > .zoom-container',
      editEnd: function (pathId) {
        app.selectId = '';
        app.editPathId = '';
        setTimeout(function () {
          app.editPathId = pathId;
        }, 0);
        addHistory();
      }
    });
    app.save(inst);
  }
  
  function i18n() {

    function addComponents() {
      $.each(window._components, function(type, obj) {
        if (obj.i18n) {
          $.each(obj.i18n, function (lang, langObj) {
            $.each(langObj, function (key, val) {
              i18next.addResource(lang,'translation', key, val);
            });            
          });
        }
      });
    };

    i18next
      .use(window.i18nextBrowserLanguageDetector)
      .use(window.i18nextXHRBackend)
      .init({
        load: 'currentOnly',
        lowerCaseLng: true,
        fallbackLng: 'en',
        preload: ['en', 'zh-tw', 'zh-cn'],
        backend: {
          "loadPath": "locales/{{lng}}.json"
        },
        debug: false
      }, function (err, t) {
        addComponents();
        jqueryI18next.init(i18next, $);
        $('body').localize();
        app.language = i18next.language;
      });
  }

  function sinkEvent() {
    var $body = $('body');
    var $lang = $('#lang');
    var d3Body = d3.select('body');

    // 依滑鼠的目標，高亮點的顯示
    $body.on('mouseover', function (evt) {
      if (app.engineStarting) {
        return;
      }
      pointFocus(evt.target);
    });

    $body.on('keydown', function (evt) {
      var key = (evt.key && evt.key.toLowerCase()) || evt.keyCode;

      if (app.engineStarting) {
        return;
      }

      // 刪除
      if (key === 'delete' || key === 'backspace' || key === 46) {
        deleteSomething();
        addHistory();
      }

      // 歷史記錄
      if (key === 'z') {
        if (evt.metaKey || evt.ctrlKey) {
          evt.shiftKey ? hm.forward() : hm.back();
          utils.importLayout(hm.getActive());
        }
      }
    });

    $lang.on('changed.bs.select', function (evt) {
      app.language = this.value;
    });

    d3Body.on('navbar-dragStart', function () {
      app.selectId = '';
      app.editPathId = '';
    });

    d3Body.on('navbar-dragEnd', function () {
      var detail = d3.event.detail;
      app.selectId = detail.targetId;
      addHistory();
    });

    d3Body.on('navbar-deleteSomething', function () {
      deleteSomething();
      addHistory();
    });

    d3Body.on('navbar-historyBack', function () {
      hm.back();
      utils.importLayout(hm.getActive());
    });

    d3Body.on('navbar-historyForward', function () {
      hm.forward();
      utils.importLayout(hm.getActive());
    });

    d3Body.on('navbar-engineStart', function () {
      app.instance.forEach(function (inst) {
        inst.destroy();
      });
      app.instance.length = 0;
      app.editPathId = '';
      app.selectId = '';
      app.engineStarting = true;
      interact.start();

      $lang.prop('disabled', true);
      $lang.selectpicker('refresh');
    });

    d3Body.on('navbar-engineStop', function () {
      drawPath();
      dndComponent();
      editPath2();
      app.engineStarting = false;
      interact.stop();

      $lang.prop('disabled', false);
      $lang.selectpicker('refresh');
    });

    d3Body.on('navbar-refresh', function () {
      var layout = utils.exportLayout();
      layout.data.components = [];
      layout.data.paths = [];
      utils.importLayout(layout);
      addHistory();
    });

    d3Body.on('navbar-zoomToFit', function () {
      zoomInst.zoomToFit();
    });

  }

  function pointFocus(target) {
    var isConnectedPoint = !!utils.getConnectPoint(target);
    var point;

    if (isConnectedPoint) {
      point = utils.getViewportCoordinate(target);
      point = zoomInst.invert(point);
      fp.focus(point);
    } else {
      fp.blur();
    }
  }

  function addHistory() {
    hm.add(utils.guid(), utils.exportLayout());
  }

  function deleteSomething() {
    if (app.editPathId) {
      d3.select('#' + app.editPathId).remove();
      app.editPathId = '';
    }

    if (app.selectId) {
      d3.select('#' + app.selectId).remove();
      app.selectId = '';
    }
  }

})();
