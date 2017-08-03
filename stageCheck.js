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
      'stages/04': stage4,
      'stages/05': stage5,
      'stages/06': stage6,
      'stages/07': stage7
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

  /**
   * 點擊模擬器按鈕時，檢查在互動區裡，玩家的數字是否增加，有增加判斷為過關
   */
  function stage5() {
    var btns = engine_.list().btn;
    var usershow = demoDoc_.getElementById('usershow');
    var isPassed = false;

    if (!btns.length) {
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(checking);
    });

    function checking() {
      if (isPassed) return;
      if (Number(usershow.textContent) > 0) {
        isPassed = true;
        checkOver();
        setTimeout(function () {
          alert('第 5 關 過關!');
        }, 1000);
      }
    }

    function checkOver() {
      btns.forEach(function (btn) {
        btn.setPressHandler(null);
      });
    }

  }

  /**
   * 檢查網頁互動區的數值，是否和超音波的數值一致，當超音波偵測數值改變時，蜂鳴器發出的頻率要有變化
   * 做法：根據超音波距離，記錄蜂鳴器發出指令，來計算出，在某個超音波距離下，蜂鳴器啟動的頻率。
   */
  function stage6() {
    var ultrasonics = engine_.list().ultrasonic;
    var buzzers = engine_.list().buzzer;
    var showEl = demoDoc_.querySelector('#show');
    var data = {};
    var curDistance = void 0;
    var isPassed = false;

    if (!ultrasonics.length) return;
    if (!buzzers.length) return;

    ultrasonics.forEach(function (us) {
      us.setSendHandler(send);
    });

    buzzers.forEach(function (bz) {
      bz.setCmdHandler(cmd);
    });

    // 當超音波距離不同時，做檢查，並建立 array 來儲存蜂鳴器命令發送的時間
    function send(distance) {
      // 檢查超音波偵測到的距離，是否和畫面相同
      if (Number(distance) !== Number(showEl.textContent)) return;

      data[distance] = data[distance] || [];
      curDistance = distance;
      checking();
    }

    // 儲存蜂鳴器送出命令的時間
    function cmd() {
      if (curDistance) {
        data[curDistance] && data[curDistance].push(Date.now());  
      }
    }

    function checking() {
      if (isPassed) return;
      if (Object.keys(data).length < 2) return;

      var aa = [];

      Object.keys(data).forEach(function (key) {
        var ary = data[key];
        var len = ary.length;
        if (len < 2) return;
        var val = (ary[len - 1] - ary[0]) / (len - 1);
        aa.push(val);
      });

      if (aa.length < 2) return;

      // 每個值，都與比 index 高的數值做比較，看是否超過 100 毫秒，只要有成立的，就算過關
      // 蜂鳴器最低的播放頻率，假設為 100 毫秒
      isPassed = aa.some(function (val, idx, ary) {
        var cp = ary.slice(idx);
        return cp.some(function (val2) {
          return Math.abs(val2 - val) > 100;
        });
      });

      if (isPassed) {
        checkOver();
        alert('第 6 關 過關!');
      }
    }

    function checkOver() {
      ultrasonics.forEach(function (us) {
        us.setSendHandler(null);
      });

      buzzers.forEach(function (bz) {
        bz.setCmdHandler(null);
      });
    }

  }

  /**
   * 檢查
   * 1. 網頁互動區的數值，是否和超音波的數值一致
   * 2. 超音波數值小於 50 時，蜂鳴器要發出聲音，並且三色 LED 有顏色變化，及伺服馬達要有 90 度的變化
   * 3. 超音波數值超過 50 時，蜂鳴器無聲，三色 LED 無變化，伺服馬達恢復 0 度
   * 做法：
   * 1. 蜂鳴器的發聲與否，以 2 筆資料為準，有 2 筆以上，判斷發聲
   * 2. 三色 led，變化與否，看儲存的顏色是否超過 1 筆
   */
  function stage7() {
    var ultrasonics = engine_.list().ultrasonic;
    var buzzers = engine_.list().buzzer;
    var rgbLeds = engine_.list().rgbled;
    var servos = engine_.list().servo;
    var showEl = demoDoc_.querySelector('#show');
    var buzzerData = {};
    var rgbData = {};
    var curDistance = void 0;
    var check = [false, false];
    var isPassed = false;

    if (!ultrasonics.length) return;
    if (!buzzers.length) return;
    if (!rgbLeds.length) return;
    if (!servos.length) return;

    ultrasonics.forEach(function (us) {
      us.setSendHandler(send);
    });

    buzzers.forEach(function (bz) {
      bz.setCmdHandler(cmd);
    });

    rgbLeds.forEach(function (rgbLed) {
      rgbLed.state(state);
    });

    // 當超音波距離不同時，做檢查，並建立 array 來儲存蜂鳴器命令發送的時間
    function send(distance) {
      // 檢查超音波偵測到的距離，是否和畫面相同
      if (Number(distance) !== Number(showEl.textContent)) return;

      // 把之前的記錄清除，以便正確判斷蜂鳴器發聲的記錄
      if (curDistance && curDistance !== distance) {
        buzzerData[curDistance] = [];
        rgbData[curDistance] = {};
      }

      buzzerData[distance] = buzzerData[distance] || [];
      rgbData[distance] = rgbData[distance] || {};
      curDistance = distance;

      if (curDistance < 50) {
        checkPoint1();
      } else {
        checkPoint2();
      }

      checking();      
    }

    // 儲存蜂鳴器送出命令的時間
    function cmd() {
      if (curDistance) {
        buzzerData[curDistance] && buzzerData[curDistance].push(Date.now());  
      }
    }

    // 儲存三色 led 狀態
    function state(r, g, b) {
      if (curDistance) {
        rgbData[curDistance]["[" + r + "," + g + "," + b + "]"] = true;
      }
    }

    function checkPoint1 () {
      if (check[0]) return;
      if (buzzerData[curDistance].length < 2) return;
      if (Object.keys(rgbData[curDistance]).length < 2) return;

      check[0] = servos.some(function (servo, idx, ary) {
        return servo.getAngle() === 90;
      });
    }

    function checkPoint2 () {
      if (check[1]) return;
      if (buzzerData[curDistance].length > 2) return;
      if (Object.keys(rgbData[curDistance]).length > 1) return;

      check[1] = servos.some(function (servo, idx, ary) {
        return servo.getAngle() === 5;
      });
    }

    function checking() {
      if (isPassed) return;
      
      isPassed = check.reduce(function (acc, val) {
        return acc && val;
      }, true);

      if (isPassed) {
        checkOver();

        // 考量畫面有些動畫未完成，所以延遲 1 秒執行
        setTimeout(function () {
          alert('第 7 關 過關!');
        }, 1000);
      }
    }

    function checkOver() {
      ultrasonics.forEach(function (us) {
        us.setSendHandler(null);
      });

      buzzers.forEach(function (bz) {
        bz.setCmdHandler(null);
      });

      rgbLeds.forEach(function (rgbLed) {
        rgbLed.state(null);
      });
    }

  }


  Code.stageCheck = {
    init: init
  };

})();