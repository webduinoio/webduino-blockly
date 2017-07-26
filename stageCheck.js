Code.stageCheck = function () {
  var stageName = Code.getStringParamFromUrl('page');
  var stage = {
    'stages/01': stage1,
    'stages/02': stage2,
    'stages/03': stage3,
    'stages/04': stage4
  };
  stage[stageName]();




  function stage1() {
    var htmlState = Code.demo.contentDocument.getElementById('light').className;
    var engineLed = Code.engine.list().led[0].value();
    if (engineLed == 1 && htmlState == 'on') {
      alert("第一關 過關!");
    }
  }




  function stage2() {
    console.log("Stage2 check...");
    var redBtn = Code.demo.contentDocument.getElementById('redBtn');
    var greenBtn = Code.demo.contentDocument.getElementById('greenBtn');
    var blueBtn = Code.demo.contentDocument.getElementById('blueBtn');
    var clearBtn = Code.demo.contentDocument.getElementById('clearBtn');
    var rgbLed = Code.engine.list()['rgbled'][0];
    var checkPoint1, checkPoint2, checkPoint3, checkPoint4;

    checkPoint1 = checkPoint2 = checkPoint3 = checkPoint4 = false;

    $(redBtn).on('click', function () {
      setTimeout(function () {
        if (rgbLed._redValue < rgbLed._greenValue && rgbLed._redValue < rgbLed._blueValue) {
          checkPoint1 = true;
          checkPointVerify();
        }
      }, 500);
    });
    $(greenBtn).on('click', function () {
      setTimeout(function () {
        if (rgbLed._greenValue < rgbLed._redValue && rgbLed._greenValue < rgbLed._blueValue) {
          checkPoint2 = true;
          checkPointVerify();
        }
      }, 500);
    });
    $(blueBtn).on('click', function () {
      setTimeout(function () {
        if (rgbLed._blueValue < rgbLed._greenValue && rgbLed._blueValue < rgbLed._redValue) {
          checkPoint3 = true;
          checkPointVerify();
        }
      }, 500);
    });
    $(clearBtn).on('click', function () {
      setTimeout(function () {
        if (rgbLed._redValue == 1 &&
          rgbLed._greenValue == 1 &&
          rgbLed._blueValue == 1) {
          checkPoint4 = true;
          checkPointVerify();
        }
      }, 500);
    });

    function checkPointVerify() {
      console.log(checkPoint1, checkPoint2, checkPoint3, checkPoint4);
      if (checkPoint1 == true &&
        checkPoint2 == true &&
        checkPoint3 == true &&
        checkPoint4 == true) {
        alert("第二關 過關!");
      } else {
        console.log("Stage2 not yet...");
      }
    }
  }


  function stage3() {
    console.log("Stage3 check...");
    var colors = {};
    var rgbLed = Code.engine.list()['rgbled'][0];
    rgbLed.state(function (r, g, b) {
      var htmlState = Code.demo.contentDocument.getElementById('light').className;
      if (htmlState == 'on') {
        colors["[" + r + "," + g + "," + b + "]"] = true;
        if (colorAmt(colors) == 14) {
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
};