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
      'stages/07': stage7,
      'stages/08': stage8,
      'stages/09': stage9,
      'stages/10': stage10,
      'stages/11': stage11,
      'stages/12': stage12,
      'stages/13': stage13,
      'stages/14': stage14,
      'stages/15': stage15
    };

    demoDoc_ = demo.contentDocument;
    engine_ = engine;

    if (!demoDoc_ || !engine_) {
      showResult(false, parseInt(stageName.slice(-2)));
      return;
    }

    stage[stageName] && stage[stageName]();
  }

  function showResult(isPassed, stageInt) {
    var stage = window.stage;

    // 若已經停止執行，就不做事了。
    if (!Code.running) return;

    if (window.ReturnGameRecord) {
      window.ReturnGameRecord('utf8', stageInt, stage.getGameTime(), stage.getSectionValues(), JSON.stringify(stage.getCode()));
      return;
    }

    if (isPassed) {
      alert("第" + stageInt + "關 過關！");
    } else {
      alert("第" + stageInt + "關 失敗！");
    }
  }




  /**
   * 關卡 1：只要模擬器中任一個 led 亮及 demo area 中的燈泡是亮的狀態，就判斷為過關
   */
  function stage1() {
    var STAGENUM = 1;
    var htmlState = demoDoc_.getElementById('light').className;
    var leds = engine_.list().led;
    var isPassed = false;

    leds.forEach(function (led) {
      if (isPassed) return;
      if (led.getValue() === 1 && htmlState === 'on') isPassed = true;
    });

    showResult(isPassed, STAGENUM);
  }

  /**
   * 關卡 2：只要模擬器中任一個 rgbLed 完成顏色的變化，就判斷為過關
   */
  function stage2() {
    var STAGENUM = 2;
    var redBtn = demoDoc_.getElementById('redBtn');
    var greenBtn = demoDoc_.getElementById('greenBtn');
    var blueBtn = demoDoc_.getElementById('blueBtn');
    var clearBtn = demoDoc_.getElementById('clearBtn');
    var rgbLedAry = engine_.list().rgbled;
    var rgbLedChecks = [];
    var checkPointExec = [false, false, false, false];
    var isPassed = false;
    var isCheckAll = false;

    if (!rgbLedAry.length) {
      showResult(false, STAGENUM);
      return;
    }

    rgbLedAry.forEach(function (rgbLed) {
      rgbLedChecks.push([false, false, false, false]);
    });

    redBtn.addEventListener('click', function () {
      checkPointExec[0] = true;
      setTimeout(function () {
        checkPoint1();
        checkPointVerify();
      }, 100);
    });

    greenBtn.addEventListener('click', function () {
      checkPointExec[1] = true;
      setTimeout(function () {
        checkPoint2();
        checkPointVerify();
      }, 100);
    });

    blueBtn.addEventListener('click', function () {
      checkPointExec[2] = true;
      setTimeout(function () {
        checkPoint3();
        checkPointVerify();
      }, 100);
    });

    clearBtn.addEventListener('click', function () {
      checkPointExec[3] = true;
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
      if (isCheckAll) return;

      isPassed = rgbLedChecks.filter(function (check) {
        return check.reduce(function(acc, val) {
          return acc && val;
        }, true);
      }).length > 0;

      isCheckAll = checkPointExec.reduce(function (acc, val) {
        return acc && val;
      }, true);

      if (isPassed) {
        showResult(true, STAGENUM);
        return;
      }

      if (isCheckAll) {
        showResult(false, STAGENUM);
      }
    }

  }

  /**
   * 關卡 3：模擬器中三色 LED 是否有做顏色的不斷變化
   */
  function stage3() {
    var STAGENUM = 3;
    var lightBtn = demoDoc_.getElementById('light');
    var rgbLedAry = engine_.list()['rgbled'];
    var rgbLedStates = [];
    var isPassed = false;
    var timer;

    if (!rgbLedAry.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    rgbLedAry.forEach(function (rgbLed) {
      rgbLedStates.push({});
    });

    lightBtn.addEventListener('click', function click() {
      if (lightBtn.classList.contains('on')) {
        // 點擊燈泡後，讓它執行 3 秒後，做檢查，進入檢查階段，就不會停止。
        timer = setTimeout(function () {
          lightBtn.removeEventListener('click', click);

          Promise.resolve()
            .then(function () {
              return new Promise(function (resolve) {
                listenState();
                setTimeout(resolve, 2000);
              });
            })
            .then(checking)
            .then(checkOver);

        }, 2000);
      } else {
        clearTimeout(timer);
      }
    });

    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var dancingBlock = xml.querySelector('block[type="rgb_led_start_dancing"]');
      if (!dancingBlock) return false;
      return dancingBlock.querySelectorAll('block[type="rgb_led_dancing_status"] block[type="rgbled_setcolor"] block[type="colour_picker"]').length > 1;
    }

    function listenState() {
      rgbLedAry.forEach(function (rgbLed, idx) {
        rgbLed.state(function (r, g, b) {
          rgbLedStates[idx]["[" + r + "," + g + "," + b + "]"] = true;
        });
      });
    }

    function checking() {
      if (isPassed) return;

      isPassed = rgbLedStates.reduce(function (acc, colors) {
        return acc || Object.keys(colors).length > 1;
      }, false);

      showResult(isPassed, STAGENUM);
    }

    function checkOver() {
      rgbLedAry.forEach(function (rgbLed, idx) {
        rgbLed.state(null);
      });
    }

  }

  /**
   * 關卡 4：點擊按鈕時，是否有完成暫停影片及播放影片的功能，以及長按按鈕來讓影片停止
   */
  function stage4() {
    var STAGENUM = 4;
    var demoWin = demoDoc_.defaultView;
    var youtube = demoWin.youtube_;
    var btns = engine_.list().btn;
    var act = void 0;
    var check = [false, false, false]; // 檢查三項，點按鈕，暫停 youtube 及播放 youtube，長按則停止。
    var isPassed = false;
    var TIMES = 10;
    var times = 0;

    if (!btns.length || !isValidBlock()) {
      showResult(false, STAGENUM);
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
          return;
        }

        // youtube 無法取到，直接判為失敗
        showResult(false, STAGENUM);

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

    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var youtbue = xml.querySelector('block[type="tutorial_youtube"]');
      var youtbueControl = xml.querySelectorAll('block[type="tutorial_youtube_control"]');
      var status = [];
      if (!youtbue || !youtbueControl) return false;

      youtbueControl = [].slice.apply(youtbueControl);
      
      // 檢查是否用到 youtbue 狀態：播放、暫定、停止
      youtbueControl.forEach(function(block) {
        var statusCode = block.querySelector('field[name="status_"]').textContent;
        status.includes(statusCode) || status.push(statusCode);
      });

      return status.length === 3;
    }

    function checking() {
      if (isPassed) return;

      isPassed = check.reduce(function (acc, val) {
        return acc && val;
      }, true);

      if (isPassed) {
        checkOver();
        
        setTimeout(function () {
          showResult(true, STAGENUM);
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
    var STAGENUM = 5;
    var btns = engine_.list().btn;
    var usershow = demoDoc_.getElementById('usershow');
    var isPassed = false;

    if (!btns.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(checking);
    });

    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var game = xml.querySelector('block[type="button_game"]');
      var gameUser = xml.querySelector('block[type="button_game_user"]');
      if (!game || !gameUser) return false;
      return true;
    }

    function checking() {
      if (isPassed) return;
      if (Number(usershow.textContent) > 0) {
        isPassed = true;
        checkOver();
        setTimeout(function () {
          showResult(true, STAGENUM);
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
    var STAGENUM = 6;
    var ultrasonics = engine_.list().ultrasonic;
    var buzzers = engine_.list().buzzer;
    var showEl = demoDoc_.querySelector('#show');
    var data = {};
    var curDistance = void 0;
    var isPassed = false;

    if (!ultrasonics.length || !buzzers.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

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

    // 檢查是否有超音波及蜂鳴器的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var ultrasonic = xml.querySelector('block[type="ultrasonic_get"]');
      var buzzer = xml.querySelector('block[type="buzzer_music_play"]');
      if (!ultrasonic || !buzzer) return false;
      return true;
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
        showResult(true, STAGENUM);
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
    var STAGENUM = 7;
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

    if (!ultrasonics.length || !buzzers.length || !rgbLeds.length || !servos.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

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

    function checkPoint1() {
      if (check[0]) return;
      if (buzzerData[curDistance].length < 2) return;
      if (Object.keys(rgbData[curDistance]).length < 2) return;

      check[0] = servos.some(function (servo, idx, ary) {
        return servo.getAngle() === 90;
      });
    }

    function checkPoint2() {
      if (check[1]) return;
      if (buzzerData[curDistance].length > 2) return;
      if (Object.keys(rgbData[curDistance]).length > 1) return;

      check[1] = servos.some(function (servo, idx, ary) {
        return servo.getAngle() === 5;
      });
    }

    // 檢查是否有用到超音波、蜂鳴器、三色 LED及伺服馬達的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var ultrasonic = xml.querySelector('block[type="ultrasonic_get"]');
      var buzzer = xml.querySelector('block[type="buzzer_music_play"]');
      var rgbled = xml.querySelector('block[type="rgbled_setcolor"]');
      var servo = xml.querySelector('block[type="servo_angle_set"], block[type="servo_angle"]');
      if (!ultrasonic || !buzzer || !rgbled || !servo) return false;
      return true;
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
          showResult(true, STAGENUM);
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

  /**
   * 調整超音波在 <10，10~20，20~30，30~40，>40，五個區間，會判斷是否符合對應的速度，符合則過關
   */
  function stage8() {
    var STAGENUM = 8;
    var demoWin = demoDoc_.defaultView;
    var ultrasonics = engine_.list().ultrasonic;
    var check = [false, false, false, false, false];
    var isPassed = false;
    var youtube;
    
    if (!ultrasonics.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    Promise.resolve()
      .then(getYoutube)
      .then(doSomething)
      .catch(errorHandler);

    function getYoutube() {
      return new Promise(function (resolve, reject) {
        var TIMES = 10;
        var times = 0;

        setTimeout(function aa() {
          times++;

          if (demoWin.youtube_) {
            youtube = demoWin.youtube_;
            resolve();
            return;
          }

          if (times > TIMES) {
            reject();
            return;
          }

          setTimeout(aa, 1000);
        }, 1000);

      });
    }

    function doSomething() {
      ultrasonics.forEach(function (us) {
        us.setSendHandler(send);
      });
    }

    function errorHandler() {
      return;
    }

    // 當超音波距離不同時，做檢查
    function send(distance) {
      var rate = youtube.getPlaybackRate();
      var area = [0, 10, 20, 30, 40];

      // 找出距離落在的區間，區間 1: 0~10，區間 2: 10~20，以此類推，大於 40 後，算區間 5
      var areaLevel = area.reduce(function (acc, val, idx, ary) {
        if (distance > val) {
          return idx + 1;
        }
        return acc;
      }, 0);

      if (areaLevel === 1 && rate === 0.5) check[0] = true;
      if (areaLevel === 2 && rate === 1) check[1] = true;
      if (areaLevel === 3 && rate === 1.25) check[2] = true;
      if (areaLevel === 4 && rate === 1.5) check[3] = true;
      if (areaLevel === 5 && rate === 2) check[4] = true;

      checking();     
    }

    // 檢查是否有用到超音波、youtbue 的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var ultrasonic = xml.querySelector('block[type="ultrasonic_get"]');
      var youtbue = xml.querySelector('block[type="tutorial_youtube"]');
      var youtbueSpeed = xml.querySelectorAll('block[type="tutorial_youtube_speed"]');
      var speed = [];
      if (!ultrasonic || !youtbue || !youtbueSpeed) return false;

      youtbueSpeed = [].slice.apply(youtbueSpeed);
      
      // 檢查是否用到 youtbue 狀態：播放、暫定、停止
      youtbueSpeed.forEach(function(block) {
        var statusCode = block.querySelector('field[name="speed_"]').textContent;
        speed.includes(statusCode) || speed.push(statusCode);
      });

      return speed.length > 1;
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
          showResult(true, STAGENUM);
        }, 1000);
      }
    }

    function checkOver() {
      ultrasonics.forEach(function (us) {
        us.setSendHandler(null);
      });
    }

  }

  /**
   * 判斷點矩陣圖形是否有持續重複變化，有則視為過關
   * 做法：過三秒後，開始偵測，至少二種圖形，且每種點矩陣圖形出現的次數都超過 3 次
   */
  function stage9() {
    var STAGENUM = 9;
    var matrixs  = engine_.list().matrix;
    var datas = {};
    var isCheck = false;
    var isPassed = false;

    if (!matrixs.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    matrixs.forEach(function (matrix) {
      matrix.state(state);
    });

    setTimeout(function () {
      isCheck = true;
    }, 3000);

    function state(hex) {
      var key = '[' + hex + ']';
      if (!datas[key]) datas[key] = [];
      datas[key].push(Date.now());
      checking();
    }

    // 檢查是否有用到點矩陣積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var matrix = xml.querySelector('block[type="max7219_draw"], block[type="max7219_animate"]');
      if (!matrix) return false;
      return true;
    }

    function checking() {
      if (!isCheck) return;
      if (isPassed) return;

      var dataKeys = Object.keys(datas);

      if (dataKeys.length < 2) return;

      isPassed = dataKeys.reduce(function (acc, val) {
        return acc && val.length > 3;
      }, true);

      if (isPassed) {
        checkOver();

        // 考量畫面有些動畫未完成，所以延遲 1 秒執行
        setTimeout(function () {
          showResult(true, STAGENUM);
        }, 1000);
      }

    }

    function checkOver() {
      matrixs.forEach(function (matrix) {
        matrix.state(null);
      });
    }

  }

  /**
   * 點擊執行後，判斷蜂鳴器是否有執行播放超級瑪麗，及網頁互動區顯示音符及節奏，都符合，則過關
   * 做法：
   * 1. 網頁互動區是否有值
   * 2. 是否播放超級瑪麗
   */
  function stage10() {
    var STAGENUM = 10;
    var buzzers = engine_.list().buzzer;
    var buzzerNotes = demoDoc_.querySelector('#buzzerNotes');
    var buzzerTempos = demoDoc_.querySelector('#buzzerTempos');
    var buzzerData = [];
    var regMary = /3347,100,3855,100,4954,100,2204,100,3347,100,2204,100,1925,100,2396,100,2618,100,2501,100,2396,100,2204,100,3855,100,4954,100,5332,100,4048,100,4954,100,3855,100,3347,100,3573,100,2618,100,3347,100,2204,100,1925,100,2396,100,2618,100,2501,100,2396,100,2204,100,3855,100,4954,100,5332,100,4048,100,4954,100,3855,100,3347,100,3573,100,2618,100/;
    var check = [false, false];
    var isPassed = false;

    if (!buzzers.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    buzzers.forEach(function (bz) {
      bz.setCmdHandler(cmd);
    });

    // 儲存蜂鳴器送出命令的時間
    function cmd(cmd) {
      buzzerData.push(cmd);
      checkPoint1();
      checkPoint2();
      checking();
    }

    function checkPoint1() {
      if (check[0]) return;
      if (!buzzerNotes.textContent) return;
      if (!buzzerTempos.textContent) return;
      check[0] = true;
    }

    function checkPoint2() {
      if (check[1]) return;
      check[1] = regMary.test(buzzerData.toString());
    }

    // 檢查是否使用到蜂鳴器相關的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var buzzerMusic = xml.querySelector('block[type="buzzer_music"]');
      var buzzerLoadMusic = xml.querySelector('block[type="buzzer_load_music"]');
      var buzzerPlay = xml.querySelector('block[type="buzzer_play"]');
      if (!buzzerMusic || !buzzerLoadMusic || !buzzerPlay) return false;
      return true;
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
          showResult(true, STAGENUM);
        }, 1000);
      }
    }

    function checkOver() {
      buzzers.forEach(function (bz) {
        bz.setCmdHandler(null);
      });
    }

  }

  /**
   * 點擊執行後，點擊按鈕，判斷點矩陣是否有變化，重複點擊按鈕，直到蜂鳴器執行，則判斷過關
   * 做法：當蜂鳴起接收到資料時，檢查點矩陣資料，資料筆數要大於 2，互動區的數字與點短陣是否相同
   */
  function stage11() {
    var STAGENUM = 11;
    var selectEl = demoDoc_.querySelector('#select');
    var btns = engine_.list().btn;
    var buzzers = engine_.list().buzzer;
    var matrixs  = engine_.list().matrix;
    var mapping = {
      "1": "00000082fe800000",
      "2": "0000f292929e0000",
      "3": "0000929292fe0000",
      "4": "00001e1010fe0000",
      "5": "00009e9292f20000",
      "6": "0000fe9292f20000"
    };
    var datas = [];
    var isPassed = false;

    if (!btns.length || !buzzers.length || !matrixs.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(press);
    });

    matrixs.forEach(function (matrix) {
      matrix.state(state);
    });

    buzzers.forEach(function (bz) {
      bz.setCmdHandler(cmd);
    });

    function press() {
      datas.length = 0;
    }

    function state(hex) {
      datas.push(hex);
    }

    function cmd() {
      setTimeout(checking, 1000);
    }

    // 檢查是否使用到按鈕、點矩陣及蜂鳴器的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var button_event = xml.querySelector('block[type="button_event"]');
      var max7219_draw = button_event.querySelector('block[type="max7219_draw"]');
      var buzzer_music_play = button_event.querySelector('block[type="buzzer_music_play"]');
      if (!button_event || !max7219_draw || !buzzer_music_play) return false;
      return true;
    }

    function checking() {
      if (isPassed) return;
      if (datas.length < 2) return;
      if (datas.slice().pop() === mapping[selectEl.value]) {
        isPassed = true;
      }

      if (isPassed) {
        checkOver();

        // 考量畫面有些動畫未完成，所以延遲 1 秒執行
        setTimeout(function () {
          showResult(true, STAGENUM);
        }, 1000);
      }

    }

    function checkOver() {
      btns.forEach(function (btn) {
        btn.setPressHandler(null);
      });

      matrixs.forEach(function (matrix) {
        matrix.state(null);
      });

      buzzers.forEach(function (bz) {
        bz.setCmdHandler(null);
      });
    }

  }

  /**
   * 操作當超音波距離 < 50 時，點擊按鈕，點矩陣顯示 O，反之則顯示 X，完成操作，則過關
   * 做法：點擊按鈕後，檢查點矩陣最後一次圖形是否為 O，前一次是否為 X，超音波距離是否小於 50
   */
  function stage12() {
    var STAGENUM = 12;
    var btns = engine_.list().btn;
    var matrixs  = engine_.list().matrix;
    var ultrasonics = engine_.list().ultrasonic;
    var pictO = ['3c4281818181423c', '0000fe8282fe0000', '00f09090f0000000', '007cc682c67c0000'];
    var pictX = ['8142241818244281', '0088502050880000', '00c66c106cc60000'];
    var data = [];
    var isPassed = false;
    var curDistance;

    if (!btns.length || !ultrasonics.length || !matrixs.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(press);
    });

    matrixs.forEach(function (matrix) {
      matrix.state(state);
    });

    ultrasonics.forEach(function (us) {
      us.setSendHandler(send);
    });

    function press() {
      setTimeout(checking, 500);
    }

    function state(hex) {
      data.push(hex);
    }

    function send(distance) {
      curDistance = Number(distance);
    }

    // 檢查是否使用到按鈕、點矩陣及超音波的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var button_event = xml.querySelector('block[type="button_event"]');
      var max7219_draw = button_event.querySelector('block[type="max7219_draw"]');
      var ultrasonic_get = xml.querySelector('block[type="ultrasonic_get"]');
      if (!button_event || !max7219_draw || !ultrasonic_get) return false;
      return true;
    }

    function checking() {
      if (isPassed) return;
      if (curDistance > 49) return;
      
      // 過濾掉點矩陣重置的指令
      var cp = data.slice().filter(function (val) {
        return val !== '0000000000000000';
      });
      
      if (pictO.includes(cp.pop()) && pictX.includes(cp.pop())) {
        isPassed = true;
      }

      if (isPassed) {
        checkOver();

        // 考量畫面有些動畫未完成，所以延遲 1 秒執行
        setTimeout(function () {
          showResult(true, STAGENUM);
        }, 1000);
      }

    }

    function checkOver() {
      btns.forEach(function (btn) {
        btn.setPressHandler(null);
      });

      matrixs.forEach(function (matrix) {
        matrix.state(null);
      });

      ultrasonics.forEach(function (us) {
        us.setSendHandler(null);
      });
    }

  }

  /**
   * 點擊按鈕後，點矩陣及網頁互動區數字一致且蜂鳴器有執行，則為過關
   * 做法：
   * 1. 點擊按鈕次數與蜂鳴器發聲次數相同
   * 2. 網頁互動區的數字與點短陣相同
   */
  function stage13() {
    var STAGENUM = 13;
    var showEl = demoDoc_.querySelector('#show');
    var btns = engine_.list().btn;
    var matrixs  = engine_.list().matrix;
    var buzzers = engine_.list().buzzer;
    var matrixNumber = JSON.parse('["0000fe8282fe0000", "00000082fe800000","0000f292929e0000","0000929292fe0000","00001e1010fe0000","00009e9292f20000","0000fe9292f20000","0000020202fe0000","0000fe9292fe0000","00009e9292fe0000","82fe8000fe82fe00","82fe800082fe8000","82fe8000f2929e00","82fe80009292fe00","82fe80001e10fe00","82fe80009e92f200","82fe8000fe92f200","82fe80000202fe00","82fe8000fe92fe00","82fe80009e92fe00","f2929e00fe82fe00","f2929e0082fe8000","f2929e00f2929e00","f2929e009292fe00","f2929e001e10fe00","f2929e009e92f200","f2929e00fe92f200","f2929e000202fe00","f2929e00fe92fe00","f2929e009e92fe00","9292fe00fe82fe00","9292fe0082fe8000","9292fe00f2929e00","9292fe009292fe00","9292fe001e10fe00","9292fe009e92f200","9292fe00fe92f200","9292fe000202fe00","9292fe00fe92fe00","9292fe009e92fe00","1e10fe00fe82fe00","1e10fe0082fe8000","1e10fe00f2929e00","1e10fe009292fe00","1e10fe001e10fe00","1e10fe009e92f200","1e10fe00fe92f200","1e10fe000202fe00","1e10fe00fe92fe00","1e10fe009e92fe00","9e92f200fe82fe00","9e92f20082fe8000","9e92f200f2929e00","9e92f2009292fe00","9e92f2001e10fe00","9e92f2009e92f200","9e92f200fe92f200","9e92f2000202fe00","9e92f200fe92fe00","9e92f2009e92fe00","fe92f200fe82fe00","fe92f20082fe8000","fe92f200f2929e00","fe92f2009292fe00","fe92f2001e10fe00","fe92f2009e92f200","fe92f200fe92f200","fe92f2000202fe00","fe92f200fe92fe00","fe92f2009e92fe00","0202fe00fe82fe00","0202fe0082fe8000","0202fe00f2929e00","0202fe009292fe00","0202fe001e10fe00","0202fe009e92f200","0202fe00fe92f200","0202fe000202fe00","0202fe00fe92fe00","0202fe009e92fe00","fe92fe00fe82fe00","fe92fe0082fe8000","fe92fe00f2929e00","fe92fe009292fe00","fe92fe001e10fe00","fe92fe009e92f200","fe92fe00fe92f200","fe92fe000202fe00","fe92fe00fe92fe00","fe92fe009e92fe00","9e92fe00fe82fe00","9e92fe0082fe8000","9e92fe00f2929e00","9e92fe009292fe00","9e92fe001e10fe00","9e92fe009e92f200","9e92fe00fe92f200","9e92fe000202fe00","9e92fe00fe92fe00","9e92fe009e92fe00"]');
    var data = [];
    var btnTimes = 0;
    var buzzerTimes = 0;
    var isPassed = false;
    var timer;

    if (!btns.length || !buzzers.length || !matrixs.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(press);
    });

    matrixs.forEach(function (matrix) {
      matrix.state(state);
    });

    buzzers.forEach(function (bz) {
      bz.setCmdHandler(cmd);
    });

    function press() {
      btnTimes++;
      clearTimeout(timer);
      timer = setTimeout(checking, 500);
    }

    function state(hex) {
      data.push(hex);
    }

    function cmd() {
      buzzerTimes++;
    }

    // 檢查是否使用到按鈕、點矩陣及蜂鳴器的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var button_event = xml.querySelector('block[type="button_event"]');
      var max7219_draw = button_event.querySelector('block[type="max7219_draw"]');
      var buzzer_music_play = button_event.querySelector('block[type="buzzer_music_play"]');
      if (!button_event || !max7219_draw || !buzzer_music_play) return false;
      return true;
    }

    function checking() {
      if (isPassed) return;
      if (btnTimes !== buzzerTimes) return;
      if (matrixNumber.indexOf(data.slice().pop()) === Number(showEl.textContent)) {
        isPassed = true;
      }
    
      if (isPassed) {
        checkOver();

        // 考量畫面有些動畫未完成，所以延遲 1 秒執行
        setTimeout(function () {
          showResult(true, STAGENUM);
        }, 1000);
      }

    }

    function checkOver() {
      btns.forEach(function (btn) {
        btn.setPressHandler(null);
      });

      matrixs.forEach(function (matrix) {
        matrix.state(null);
      });

      buzzers.forEach(function (bz) {
        bz.setCmdHandler(null);
      });
    }

  }

  /**
   * 點擊按鈕後，伺服馬達轉 90 度，且網頁互動區也顯示 90，再點擊，則旋轉 0 度，互動區也顯示 0，完成該操作則過關
   * 做法：點擊按鈕後，做檢查，檢查互動區的值，與伺服馬達旋轉角度是否一致。此外，要檢查二種情況 0, 90 度。
   */
  function stage14() {
    var STAGENUM = 14;
    var showEl = demoDoc_.querySelector('#show');
    var btns = engine_.list().btn;
    var servos = engine_.list().servo;
    var check = [false, false];
    var isPassed = false;
    var timer;

    if (!btns.length || !servos.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    btns.forEach(function (btn) {
      btn.setPressHandler(press);
    });

    function press() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var demoAngle = parseInt(showEl.textContent);
        if (demoAngle === 0) checkPoint1();
        if (demoAngle === 90) checkPoint2();
        checking();
      }, 300);
    }

    function checkPoint1() {
      if (check[0]) return;
      check[0] = servos.some(function (servo) {
        var angle = servo.getAngle();
        return angle === 0 || angle === 5;
      });
    }

    function checkPoint2() {
      if (check[1]) return;
      check[1] = servos.some(function (servo) {
        var angle = servo.getAngle();
        return angle === 90;
      });
    }

    // 檢查是否使用到按鈕、伺服馬達的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var button_event = xml.querySelector('block[type="button_event"]');
      var servo_angle = button_event.querySelectorAll('block[type="servo_angle"], block[type="servo_angle_set"]');
      if (!button_event) return false;
      return servo_angle.length > 1;
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
          showResult(true, STAGENUM);
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
   * 判斷超音波的距離，會顯示在互動區及點矩陣上，完成此操作則過關
   */
  function stage15() {
    var STAGENUM = 15;
    var showEl = demoDoc_.querySelector('#show');
    var matrixs  = engine_.list().matrix;
    var ultrasonics = engine_.list().ultrasonic;
    var matrixNumber = JSON.parse('["0000fe8282fe0000", "00000082fe800000","0000f292929e0000","0000929292fe0000","00001e1010fe0000","00009e9292f20000","0000fe9292f20000","0000020202fe0000","0000fe9292fe0000","00009e9292fe0000","82fe8000fe82fe00","82fe800082fe8000","82fe8000f2929e00","82fe80009292fe00","82fe80001e10fe00","82fe80009e92f200","82fe8000fe92f200","82fe80000202fe00","82fe8000fe92fe00","82fe80009e92fe00","f2929e00fe82fe00","f2929e0082fe8000","f2929e00f2929e00","f2929e009292fe00","f2929e001e10fe00","f2929e009e92f200","f2929e00fe92f200","f2929e000202fe00","f2929e00fe92fe00","f2929e009e92fe00","9292fe00fe82fe00","9292fe0082fe8000","9292fe00f2929e00","9292fe009292fe00","9292fe001e10fe00","9292fe009e92f200","9292fe00fe92f200","9292fe000202fe00","9292fe00fe92fe00","9292fe009e92fe00","1e10fe00fe82fe00","1e10fe0082fe8000","1e10fe00f2929e00","1e10fe009292fe00","1e10fe001e10fe00","1e10fe009e92f200","1e10fe00fe92f200","1e10fe000202fe00","1e10fe00fe92fe00","1e10fe009e92fe00","9e92f200fe82fe00","9e92f20082fe8000","9e92f200f2929e00","9e92f2009292fe00","9e92f2001e10fe00","9e92f2009e92f200","9e92f200fe92f200","9e92f2000202fe00","9e92f200fe92fe00","9e92f2009e92fe00","fe92f200fe82fe00","fe92f20082fe8000","fe92f200f2929e00","fe92f2009292fe00","fe92f2001e10fe00","fe92f2009e92f200","fe92f200fe92f200","fe92f2000202fe00","fe92f200fe92fe00","fe92f2009e92fe00","0202fe00fe82fe00","0202fe0082fe8000","0202fe00f2929e00","0202fe009292fe00","0202fe001e10fe00","0202fe009e92f200","0202fe00fe92f200","0202fe000202fe00","0202fe00fe92fe00","0202fe009e92fe00","fe92fe00fe82fe00","fe92fe0082fe8000","fe92fe00f2929e00","fe92fe009292fe00","fe92fe001e10fe00","fe92fe009e92f200","fe92fe00fe92f200","fe92fe000202fe00","fe92fe00fe92fe00","fe92fe009e92fe00","9e92fe00fe82fe00","9e92fe0082fe8000","9e92fe00f2929e00","9e92fe009292fe00","9e92fe001e10fe00","9e92fe009e92f200","9e92fe00fe92f200","9e92fe000202fe00","9e92fe00fe92fe00","9e92fe009e92fe00"]');
    var data = [];
    var isPassed = false;
    var curDistance;

    if (!matrixs.length || !ultrasonics.length || !isValidBlock()) {
      showResult(false, STAGENUM);
      return;
    }

    ultrasonics.forEach(function (us) {
      us.setSendHandler(send);
    });

    matrixs.forEach(function (matrix) {
      matrix.state(state);
    });

    function send(distance) {
      if (!curDistance) {
        curDistance = Number(distance);
        return;
      }

      if (curDistance !== Number(distance)) {
        setTimeout(checking, 300);
        curDistance = Number(distance);
      }
    }

    function state(hex) {
      data.push(hex);
    }

    // 檢查是否使用到點矩陣及超音波的積木
    function isValidBlock() {
      var xml = window.stage.getBlockXml();
      var ultrasonic_get = xml.querySelector('block[type="ultrasonic_get"]');
      var max7219_draw = ultrasonic_get.querySelector('block[type="max7219_draw"]');
      if (!ultrasonic_get || !max7219_draw) return false;
      return true;
    }

    function checking() {
      if (isPassed) return;
      if (curDistance !== Number(showEl.textContent)) return;
      if (curDistance === matrixNumber.indexOf(data.slice().pop())) {
        isPassed = true;
      }
    
      if (isPassed) {
        checkOver();
        showResult(true, STAGENUM);
      }

    }

    function checkOver() {
      ultrasonics.forEach(function (us) {
        us.setSendHandler(null);
      });

      matrixs.forEach(function (matrix) {
        matrix.state(null);
      });
    }

  }

  Code.stageCheck = {
    init: init
  };

})();