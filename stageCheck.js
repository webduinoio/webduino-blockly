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
    stage[stageName]();
  }




  function stage1() {
    var htmlState = demoDoc_.getElementById('light').className;
    var engineLed = engine_.list().led[0].value();
    if (engineLed === 1 && htmlState === 'on') {
      alert("第一關 過關!");
    }
  }

  function stage2() {
    var redBtn = demoDoc_.getElementById('redBtn');
    var greenBtn = demoDoc_.getElementById('greenBtn');
    var blueBtn = demoDoc_.getElementById('blueBtn');
    var clearBtn = demoDoc_.getElementById('clearBtn');
    var rgbLed = engine_.list()['rgbled'][0];
    var checkPoint1, checkPoint2, checkPoint3, checkPoint4;

    checkPoint1 = checkPoint2 = checkPoint3 = checkPoint4 = false;

    redBtn.addEventListener('click', function () {
      setTimeout(function () {
        if (rgbLed._redValue < rgbLed._greenValue && rgbLed._redValue < rgbLed._blueValue) {
          checkPoint1 = true;
          checkPointVerify();
        }
      }, 500);
    });

    greenBtn.addEventListener('click', function () {
      setTimeout(function () {
        if (rgbLed._greenValue < rgbLed._redValue && rgbLed._greenValue < rgbLed._blueValue) {
          checkPoint2 = true;
          checkPointVerify();
        }
      }, 500);
    });

    blueBtn.addEventListener('click', function () {
      setTimeout(function () {
        if (rgbLed._blueValue < rgbLed._greenValue && rgbLed._blueValue < rgbLed._redValue) {
          checkPoint3 = true;
          checkPointVerify();
        }
      }, 500);
    });

    clearBtn.addEventListener('click', function () {
      setTimeout(function () {
        if (rgbLed._redValue === 1 &&
          rgbLed._greenValue === 1 &&
          rgbLed._blueValue === 1) {
          checkPoint4 = true;
          checkPointVerify();
        }
      }, 500);
    });

    function checkPointVerify() {
      console.log(checkPoint1, checkPoint2, checkPoint3, checkPoint4);
      if (checkPoint1 === true &&
        checkPoint2 === true &&
        checkPoint3 === true &&
        checkPoint4 === true) {
        alert("第二關 過關!");
      } else {
        console.log("Stage2 not yet...");
      }
    }

  }

  function stage3() {
    var colors = {};
    var rgbLed = engine_.list()['rgbled'][0];
    rgbLed.state(function (r, g, b) {
      var htmlState = demoDoc_.getElementById('light').className;
      if (htmlState === 'on') {
        colors["[" + r + "," + g + "," + b + "]"] = true;
        if (colorAmt(colors) === 14) {
          alert('第三關 過關!');
          rgbLed.state(function () {});
        }
      }
    });

    function colorAmt(obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }
  }

  function stage4() {

  }




  Code.stageCheck = {
    init: init
  };

})();