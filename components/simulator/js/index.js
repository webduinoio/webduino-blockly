+(function() {
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
      drawingPath: false,  // 畫線狀態
      movingCircle: false, // 編輯時，移動圓點
      g_id_edit: '',       // 目前在編輯狀態的 path
      selectId: '',        // 目前 focus 的元件
      instance: [],        // 保存使用的功能實例
      engineStarting: false   // Engine 是否啟動中
    },
    methods: {
      save: function (inst) {
        this.instance.push(inst);
      },
      engineStart: function () {
        this.instance.forEach(function (inst) {
          inst.destroy();
        });
        this.instance.length = 0;
        this.g_id_edit = '';
        this.selectId = '';
        this.engineStarting = true;
      },
      engineStop: function () {
        drawPath();
        dndComponent();
        editPath2();
        this.engineStarting = false;
      },
      deleteSomething: function () {
        if (app.g_id_edit) {
          d3.select('#' + app.g_id_edit).remove();
          app.g_id_edit = '';
        }

        if (app.selectId) {
          d3.select('#' + app.selectId).remove();
          app.selectId = '';
        }
      }
    }
  });

  app.$watch('drawingPath', function(newVal, oldVal) {
    if (newVal) {
      svg.classed('drawingPath', true);
    } else {
      svg.classed('drawingPath', false);
    }
  });

  app.$watch('movingCircle', function(newVal, oldVal) {
    if (newVal) {
      svg.classed('movingCircle', true);
    } else {
      svg.classed('movingCircle', false);
    }
  });

  app.$watch('g_id_edit', function(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }
    oldVal && pathContainer.select('#' + oldVal).classed('editing', false);
    newVal && pathContainer.select('#' + newVal).classed('editing', true);

    new EditPath({
      area: '.edit-content',
      pathId: this.g_id_edit,
      movePointStart: function () {
        app.movingCircle = true;
      },
      movePointEnd: function () {
        app.movingCircle = false;
        addHistory();
      }
    });

  });

  app.$watch('selectId', function(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }

    var area = d3.select(utils.config.componentArea);
    oldVal && area.select('#' + oldVal).select('[name="selected"]').attr('opacity', 0);
    newVal && area.select('#' + newVal).select('[name="selected"]').attr('opacity', 1);
  });


  // 點的聚焦顯示
  var fp = new FocusPoint({
    container: '.zoom-container'
  });

  // 縮放功能
  window._zoomInst = new Zoom('svg', '.zoom-container');

  // 歷史管理
  var hm = new HistoryManager();
  
  addHistory();
  drawPath();
  dndComponent();
  editPath2();
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
        app.g_id_edit = '';
      },
      drawDrag: function (elem) {
        pointFocus(elem);
      },
      drawEnd: function (pathId) {
        fp.blur();
        app.drawingPath = false;
        if (pathId) {
          app.g_id_edit = pathId;
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
        app.g_id_edit = '';
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
        app.g_id_edit = '';
        setTimeout(function () {
          app.g_id_edit = pathId;  
        }, 0);
        addHistory();
      }
    });
    app.save(inst);
  }

  function sinkEvent() {
    var $body = $('body');
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
        app.deleteSomething();
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

    d3Body.on('navbar-dragStart', function () {
      app.selectId = '';
      app.g_id_edit = '';
    });

    d3Body.on('navbar-dragEnd', function () {
      var detail = d3.event.detail;
      app.selectId = detail.targetId;
      addHistory();
    });

    d3Body.on('navbar-deleteSomething', function () {
      app.deleteSomething();
      addHistory();
    });

    d3Body.on('navbar-engineStart', function () {
      app.engineStart();
    });

    d3Body.on('navbar-engineStop', function () {
      app.engineStop();
    });

  }

  function pointFocus(target) {
    var isConnectedPoint = !!utils.getConnectPoint(target);
    var point;

    if (isConnectedPoint) {
      point = utils.getViewportCoordinate(target);
      point = _zoomInst.invert(point);
      fp.focus(point);
    } else {
      fp.blur();
    }
  }

  function addHistory() {
    hm.add(utils.guid(), utils.exportLayout());
  }

})();
