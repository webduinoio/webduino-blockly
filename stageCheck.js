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

    if (isPass) alert("第 1 關 過關!");
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
        alert("第 2 關 過關!");
      } else {
        console.log("Stage2 not yet...");
      }
    }

  }

  /**
   * 關卡 3：模擬器中三色 LED 是否有做顏色的不斷變化
   */
  function stage3() {
    var lightBtn = demoDoc_.getElementById('light');
    var isPass = false;

    lightBtn.addEventListener('click', function() {
      if (lightBtn.classList.contains('on')) {
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
            alert('第 3 關 過關!');
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

  /**
   * 關卡 4：點擊按鈕時，是否有完成暫停影片及播放影片的功能，以及長按按鈕來讓影片停止
   */
  function stage4() {
    var demoWin = demoDoc_.defaultView;
    var youtube = demoWin.youtube_;
    var btns = engine_.list().btn;
    var act = void 0;
    var check = [false, false, false]; // 檢查三項，點按鈕，暫停 youtube 及播放 youtube，長按則停止。
    var isPassed = false;
    var TIMES = 10;
    var times = 0;

    if (!btns.length) {
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(press);
      btn.setSustainedPressHandler(sustainedPress);
    });

    if (youtube) {
      youtube.addEventListener('onStateChange', stageChange);
    } else {
      setTimeout(function aa() {
        times++;
        if (demoWin.youtube_) {
          youtube = demoWin.youtube_;
          youtube.addEventListener('onStateChange', stageChange);
          return;
        }

        if (times < TIMES) {
          setTimeout(aa, 1000);
        }

      }, 1000);
    }

    function press() {
      act = 'press';
    }

    function sustainedPress() {
      act = 'sustainedPress';
    }

    function stageChange(evt) {
      var state = evt.data;

      if (act) {
        if (act === 'press' && state === demoWin.YT.PlayerState.PAUSED) check[0] = true;
        if (act === 'press' && state === demoWin.YT.PlayerState.PLAYING) check[1] = true;
        if (act === 'sustainedPress' && state === -1) check[2] = true;
        act = void 0;
      }
      checking(); 
    }

    function checking() {
      if (isPassed) return;

      var isPass = check.reduce(function (acc, val) {
        return acc && val;
      }, true);

      if (isPass) {
        isPassed = true;
        checkOver();
        
        setTimeout(function () {
          alert('第 4 關 過關!');
        }, 1000);
      }
    }

    function checkOver() {
      youtube.removeEventListener('onStateChange', stageChange);
      btns.forEach(function (btn) {
        btn.setPressHandler(null);
        btn.setSustainedPressHandler(null);
      });
    }

  }


  

  Code.stageCheck = {
    init: init
  };

})();