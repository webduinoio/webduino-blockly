+(function() {
  
  var utils = window.utils;
  var Snap = window.Snap;

  /**
   * vue instance - navbar
   */
  var navbar = new Vue({
    el: '#navbar',
    data: {
      isComponentsVisible: false, // 顯示元件區
      isPlaying: false // engine 是否啟動中
    },
    mounted: function() {
      this.$el.childNodes[0].classList.remove('hidden');
    },
    methods: {
      menuToggle: function() {
        wrapper.isComponentsVisible = !wrapper.isComponentsVisible;
      },
      engineToggle: function() {
        this.isPlaying = !this.isPlaying;
        this.isPlaying ? engineStart() : engineStop();
      },
      zoomToFit: function () {
        _zoomInst.zoomToFit();
      },
      deleteSomething: function () {
        utils.dispatchEvent('navbar-deleteSomething');
      }
    }
  });

  /**
   * vue instance - components container
   */
  var wrapper = new Vue({
    el: '#wrapper',
    data: {
      isComponentsVisible: false, // 元件區的顯示/隱藏
      components: '',
      dragging: false             // 拖拉元件
    },
    beforeMount: function() {
      this.components = getComponentHtml();
    },
    methods: {
      setDragging: function(bol) {
        this.dragging = bol;
      }
    }
  });
  
  componentDragging();

  /**
   * 取得添加元件的 html
   * @return {string} html string
   */
  function getComponentHtml() {
    var WRAPPER = '<div class="col-xs-6 kk-item" ></div>';
    var DEFAULT_IMG = '<img src="http://i.imgur.com/Q89wwdR.jpg" draggable="false">';
    var htmls = [];
    var $wrapper = $(WRAPPER);

    $.each(window._components, function(type, obj) {
      if (obj.notInContainer) {
        return;
      }
      var img = (obj.icon && '<img src="' + obj.icon + '" draggable="false">') || DEFAULT_IMG;
      var text = '<span class="kk-item-text">' + ( obj.label || obj.type ) + '</span>';
      var $wrap = $wrapper.clone().append(img, text);
      $wrap.attr('data-type', obj.type);
      htmls.push($wrap.get(0).outerHTML);
    });
    return htmls.join('');
  }

  /**
   * 元件拖拉
   */
  function componentDragging() {
    var svg = d3.select('#wrapper');

    svg.call(d3Drag())

    function d3Drag() {
      var container = d3.select('#editArea > .zoom-container');
      var dragElement, dragTarget;

      return d3.drag()
        .on('start', start)
        .on('drag', drag)
        .on('end', end)
        .container(function() {
          return container.node();
        })
        .filter(function() {
          var target = d3.event.target;
          var $target = $(target);
          dragTarget = $target.hasClass('kk-item') ? target : $target.parents('.kk-item').first().get(0);
          return !!dragTarget;
        });

      function start() {
        var $area = $('svg .components-area');
        var type = dragTarget.dataset.type;
        var bbox;

        dragElement = utils.createComponent(type);
        d3.select(dragElement).classed('dragging', true);
        $area.append(dragElement);

        // 這裡不用做一手轉換，因為使用 translate 的元素，又是一個新的座標系統
        // 在這新的座標系統裡的元素大小，就是 bbox 得到的值
        bbox = Snap(dragElement).getBBox();
        utils.translate(dragElement, d3.event.x - Math.round(bbox.width/2), d3.event.y - Math.round(bbox.height/2));

        wrapper.setDragging(true);
        navbar.menuToggle();
        utils.dispatchEvent('navbar-dragStart');
      }

      function drag() {
        var cur = utils.getTransformObj(dragElement);
        cur.x += d3.event.dx;
        cur.y += d3.event.dy;
        utils.translate(dragElement, cur.x, cur.y);
      }

      function end() {
        d3.select(dragElement).classed('dragging', false);
        wrapper.setDragging(false);
        navbar.menuToggle();
        utils.updateLocationData(dragElement);
        utils.dispatchEvent('navbar-dragEnd', { targetId: dragElement.id });
      }

    }

  }

  /**
   * 啟動 engine
   */
  function engineStart() {
    utils.dispatchEvent('navbar-engineStart');
    interact.start();
  }

  /**
   * 停止 engine
   */
  function engineStop() {
    utils.dispatchEvent('navbar-engineStop');
    interact.stop();
  }
  
})();