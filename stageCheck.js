+(function () {
  "use strict";

  var Code = window.Code;
  var demoDoc_, engine_;

  function init(demo, engine) {
    var stageName = Code.getStringParamFromUrl('page');
    var stage = {
      'stages/01': stage1,
      'stages/02': stage2,
      'stages/03': stage3,
      'stages/04': stage4
    };

    demoDoc_ = demo.contentDocument;
    engine_ = engine;
    stage[stageName] && stage[stageName]();
  }




  /**
   * 關卡 1：只要模擬器中任一個 led 亮及 demo area 中的燈泡是亮的狀態，就判斷為過關
   */
  function stage1() {
    var htmlState = demoDoc_.getElementById('light').className;
    var leds = engine_.list().led;
    var isPass = false;

    leds.forEach(function (led) {
      if (isPass) return;
      if (led.getValue() === 1 && htmlState === 'on') isPass = true;
    });

    if (isPass) alert("第一關 過關!");
  }

  /**
   * 關卡 2：只要模擬器中任一個 rgbLed 完成顏色的變化，就判斷為過關
   */
  function stage2() {
    var redBtn = demoDoc_.getElementById('redBtn');
    var greenBtn = demoDoc_.getElementById('greenBtn');
    var blueBtn = demoDoc_.getElementById('blueBtn');
    var clearBtn = demoDoc_.getElementById('clearBtn');
    var rgbLedAry = engine_.list()['rgbled'];
    var rgbLedChecks = [];
    var isPassed = false;

    rgbLedAry.forEach(function (rgbLed) {
      rgbLedChecks.push([false, false, false, false]);
    });

    redBtn.addEventListener('click', function () {
      setTimeout(function () {
        checkPoint1();
        checkPointVerify();
      }, 100);
    });

    greenBtn.addEventListener('click', function () {
      setTimeout(function () {
        checkPoint2();
        checkPointVerify();
      }, 100);
    });

    blueBtn.addEventListener('click', function () {
      setTimeout(function () {
        checkPoint3();
        checkPointVerify();
      }, 100);
    });

    clearBtn.addEventListener('click', function () {
      setTimeout(function () {
        checkPoint4();
        checkPointVerify();
      }, 100);
    });

    function checkPoint1() {
      rgbLedAry.forEach(function (rgbLed, idx) {
        if (rgbLed.getRedValue() < rgbLed.getGreenValue() && rgbLed.getRedValue() < rgbLed.getBlueValue()) {
          rgbLedChecks[idx][0] = true;
        }
      });
    }

    function checkPoint2() {
      rgbLedAry.forEach(function (rgbLed, idx) {
        if (rgbLed.getGreenValue() < rgbLed.getRedValue() && rgbLed.getGreenValue() < rgbLed.getBlueValue()) {
          rgbLedChecks[idx][1] = true;
        }
      });
    }

    function checkPoint3() {
      rgbLedAry.forEach(function (rgbLed, idx) {
        if (rgbLed.getBlueValue() < rgbLed.getGreenValue() && rgbLed.getBlueValue() < rgbLed.getRedValue()) {
          rgbLedChecks[idx][2] = true;
        }
      });
    }

    function checkPoint4() {
      rgbLedAry.forEach(function (rgbLed, idx) {
        if (rgbLed.getRedValue() === 1 &&
          rgbLed.getGreenValue() === 1 &&
          rgbLed.getBlueValue() === 1) {
          rgbLedChecks[idx][3] = true;
        }
      });
    }

    function checkPointVerify() {
      if (isPassed) return;

      var isPass = rgbLedChecks.filter(function (check) {
        return check.reduce(function(acc, val) {
          return acc && val;
        }, true);
      }).length > 0;

      if (isPass) {
        isPassed = true;
        alert("第二關 過關!");
      } else {
        console.log("Stage2 not yet...");
      }
    }

  }

  function stage3() {
    var lightBtn = demoDoc_.getElementById('light');
    var isPass = false;

    lightBtn.addEventListener('click', function() {
      if (lightBtn.classList.contains('on')) {
        console.log('==> 開始');
        setTimeout(checking, 3000);
      }
    });

    function checking() {
      var rgbLedAry = engine_.list()['rgbled'];

      rgbLedAry.forEach(function (rgbLed) {
        var colors = {};
        rgbLed.state(function (r, g, b) {
          if (isPass) return;

          colors["[" + r + "," + g + "," + b + "]"] = true;
          if (Object.keys(colors).length > 1) {
            isPass = true;
            alert('第三關 過關!');
            checkOver();
          }
        });
      });

    }

    function checkOver() {
      var rgbLedAry = engine_.list()['rgbled'];
      rgbLedAry.forEach(function (rgbLed) {
        rgbLed.state(null);
      });
    }

  }

  function stage4() {

  }




  Code.stageCheck = {
    init: init
  };

})();