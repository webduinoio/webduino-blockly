+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(window);
  } else {
    module.exports = factory;
  }
}(function (scope) {

  'use strict';

  var boards = [],
    undef = void 0;

  var orientationEventListener = function () {};
  var motionEventListener = function () {};

  var konamiCode = "";

  var speakSynth = scope.speechSynthesis;

  function boardReady(options, autoReconnect, callback) {
    var callback = (typeof autoReconnect === 'function' ? autoReconnect : callback),
      index = boards.length,
      board = createBoard(options),
      terminate = function () {
        board = null;
        delete boards[index];
        boards.splice(index, 1);

        if (autoReconnect === true) {
          setTimeout(function () {
            boardReady(options, autoReconnect, callback);
          }, 5000);
        }
      };

    board.once(webduino.BoardEvent.ERROR, function (err) {
      if (board.isConnected) {
        board.once(webduino.BoardEvent.DISCONNECT, terminate);
        board.disconnect();
      } else {
        terminate();
      }
    });

    board.once(webduino.BoardEvent.READY, callback);

    boards.push(board);
  }

  function createBoard(opts) {
    if (typeof opts === 'string') {
      opts = {
        device: opts
      };
    }

    if (opts.board) {
      return new webduino.board[opts.board](opts);
    } else {
      if (opts.device || opts.url) {
        return new webduino.WebArduino(opts);
      } else {
        return new webduino.Arduino(opts);
      }
    }
  }

  function getPin(board, pinNum) {
    if (board.transport) {
      board = searchBoard(board);
    }

    return board ? board.getPin(pinNum) : undef;
  }

  function searchBoard(options) {
    var keys = Object.keys(options),
      candidate,
      matched;

    boards.some(function (b) {
      matched = !keys.some(function (k) {
        return options[k] !== b._options[k];
      });
      if (matched) {
        candidate = b;
      }
      return matched;
    });

    return candidate;
  }

  function konami(c, callback) {
    var k = "38384040373937396665";
    konamiCode = konamiCode + c;
    if (konamiCode.length > k.length) {
      konamiCode = konamiCode.replace(konamiCode.slice(0, 2), "")
    }
    console.log(konamiCode);
    if (typeof callback === "function" && konamiCode == k) {
      callback();
    }
  }


  function setDeviceOrientationListener(listener) {
    removeDeviceOrientationListener();

    if (typeof listener === 'function') {
      orientationEventListener = function (event) {
        var alpha, beta, gamma;
        if (event.webkitCompassHeading) {
          alpha = event.webkitCompassHeading;
        } else {
          alpha = event.alpha;
          if (!scope.chrome) {
            alpha = alpha - 270;
          }
        }
        beta = event.beta;
        gamma = event.gamma;
        listener.apply(this, [alpha, beta, gamma]);
      };

      scope.addEventListener('deviceorientation', orientationEventListener);
    }
  }

  function removeDeviceOrientationListener() {
    scope.removeEventListener('deviceorientation', orientationEventListener);
  }

  function setDeviceMotionListener(listener) {
    removeDeviceMotionListener();

    if (typeof listener === 'function') {
      motionEventListener = function (event) {
        var x, y, z;
        x = event.acceleration.x;
        y = event.acceleration.y;
        z = event.acceleration.z;
        listener.apply(this, [x, y, z]);
      };

      scope.addEventListener('devicemotion', motionEventListener);
    }
  }

  function speak(text, setting, callback, type) {
    speakSynth.cancel();
    if (!speakSynth.speaking) {
      var utterThis = new SpeechSynthesisUtterance(text);
      if (typeof setting === 'function') {
        callback = setting;
        setting = ['zh-TW', 1, 1, 1];
      }
      if (!setting) {
        setting = ['zh-TW', 1, 1, 1];
      }
      utterThis.lang = setting[0] || 'zh-TW';
      utterThis.volume = setting[1] || 1;
      utterThis.pitch = setting[2] || 1;
      utterThis.rate = setting[3] || 1;
      speakSynth.speak(utterThis);
      if (typeof callback === 'function') {
        if (type == 0) {
          utterThis.onend = function () {
            callback();
          };
        } else {
          utterThis.onstart = function () {
            callback();
          };
        }
      }
    }
  }


  function removeDeviceMotionListener() {
    scope.removeEventListener('devicemotion', motionEventListener);
  }

  function getLed(board, pin) {
    return new webduino.module.Led(board, board.getDigitalPin(pin));
  }

  function getRelay(board, pin) {
    return new webduino.module.Relay(board, board.getDigitalPin(pin));
  }

  function getRGBLed(board, red, green, blue) {
    return new webduino.module.RGBLed(board, board.getDigitalPin(red), board.getDigitalPin(green), board.getDigitalPin(blue));
  }

  function getRGBLedCathode(board, red, green, blue) {
    return new webduino.module.RGBLed(board, board.getDigitalPin(red), board.getDigitalPin(green), board.getDigitalPin(blue), webduino.module.RGBLed.COMMON_CATHODE);
  }

  function getUltrasonic(board, trig, echo) {
    return new webduino.module.Ultrasonic(board, board.getDigitalPin(trig), board.getDigitalPin(echo));
  }

  function getButton(board, pin) {
    return new webduino.module.Button(board, board.getDigitalPin(pin));
  }

  function getPullupButton(board, pin) {
    return new webduino.module.Button(board, board.getDigitalPin(pin), webduino.module.Button.PULL_UP);
  }

  function getPir(board, pin) {
    return new webduino.module.Pir(board, board.getDigitalPin(pin));
  }

  function getSound(board, pin) {
    return new webduino.module.Sound(board, board.getDigitalPin(pin));
  }

  function getShock(board, pin) {
    return new webduino.module.Shock(board, board.getDigitalPin(pin));
  }

  function getDht(board, pin) {
    return new webduino.module.Dht(board, board.getDigitalPin(pin));
  }

  function getBuzzer(board, pin) {
    return new webduino.module.Buzzer(board, board.getDigitalPin(pin));
  }

  function getServo(board, pin) {
    return new webduino.module.Servo(board, board.getDigitalPin(pin));
  }

  function getMax7219(board, din, cs, clk) {
    return new webduino.module.Max7219(board, board.getDigitalPin(din), board.getDigitalPin(cs), board.getDigitalPin(clk));
  }

  function getPhotocell(board, analogpin) {
    return new webduino.module.Photocell(board, analogpin);
  }

  function getIRRecv(board, pin) {
    return new webduino.module.IRRecv(board, board.getDigitalPin(pin));
  }

  function getIRLed(board, encode) {
    return new webduino.module.IRLed(board, encode);
  }

  function getADXL345(board) {
    return new webduino.module.ADXL345(board);
  }

  function getJoystick(board, vrx, vry, sw) {
    return new webduino.module.Joystick(board, vrx, vry, board.getDigitalPin(sw));
  }

  function getRFID(board) {
    return new webduino.module.RFID(board);
  }

  function getSoil(board, analogpin) {
    return new webduino.module.Soil(board, analogpin);
  }

  function getToyCar(board, RF, RB, LF, LB) {
    return new ToyCar(board, RF, RB, LF, LB);
  }

  function ToyCar(board, RF, RB, LF, LB) {
    this._rf = getPin(board, RF);
    this._rf.setMode(1);
    this._rb = getPin(board, RB);
    this._rb.setMode(1);
    this._lf = getPin(board, LF);
    this._lf.setMode(1);
    this._lb = getPin(board, LB);
    this._lb.setMode(1);
  }

  ToyCar.prototype.goFront = function () {
    this._rf.write(1);
    this._rb.write(0);
    this._lf.write(1);
    this._lb.write(0);
  };

  ToyCar.prototype.goBack = function () {
    this._rf.write(0);
    this._rb.write(1);
    this._lf.write(0);
    this._lb.write(1);
  };

  ToyCar.prototype.goRight = function () {
    this._rf.write(0);
    this._rb.write(0);
    this._lf.write(1);
    this._lb.write(0);
  };

  ToyCar.prototype.goLeft = function () {
    this._rf.write(1);
    this._rb.write(0);
    this._lf.write(0);
    this._lb.write(0);
  };

  ToyCar.prototype.turnRight = function () {
    this._rf.write(0);
    this._rb.write(1);
    this._lf.write(1);
    this._lb.write(0);
  };

  ToyCar.prototype.turnLeft = function () {
    this._rf.write(1);
    this._rb.write(0);
    this._lf.write(0);
    this._lb.write(1);
  };

  ToyCar.prototype.backLeft = function () {
    this._rf.write(0);
    this._rb.write(0);
    this._lf.write(0);
    this._lb.write(1);
  };

  ToyCar.prototype.backRight = function () {
    this._rf.write(0);
    this._rb.write(1);
    this._lf.write(0);
    this._lb.write(0);
  };

  ToyCar.prototype.stop = function () {
    this._rf.write(0);
    this._rb.write(0);
    this._lf.write(0);
    this._lb.write(0);
  };

  ToyCar.prototype.onlyLeftFront = function () {
    this._rf.write(1);
    this._rb.write(0);
  };

  ToyCar.prototype.onlyRightFront = function () {
    this._lf.write(1);
    this._lb.write(0);
  };

  ToyCar.prototype.onlyLeftBack = function () {
    this._rf.write(1);
    this._rb.write(0);
  };

  ToyCar.prototype.onlyRightBack = function () {
    this._lf.write(1);
    this._lb.write(0);
  };

  ToyCar.prototype.onlyLeftStop = function () {
    this._rf.write(0);
    this._rb.write(0);
  };

  ToyCar.prototype.onlyRightStop = function () {
    this._lf.write(0);
    this._lb.write(0);
  };

  //DHT Area Chart
  function dhtAreaChart(tcolor, hcolor) {
    var areaChart = function () {
      var loaded = false;
      var origin = [
        ['Time', 'temperature', 'humidity']
      ];

      google.load("visualization", "1", {
        packages: ["corechart"],
        callback: function () {
          loaded = true;
        }
      });

      function drawChart(d) {
        if (!Array.isArray(d)) {
          return;
        }
        var data = google.visualization.arrayToDataTable(d);

        var options = {
          title: "DHT Area Chart",
          hAxis: {
            title: '',
            titleTextStyle: {
              color: '#333'
            }
          },
          vAxis: {
            minValue: 0
          },
          chartArea: {
            top: 50,
            left: 50,
            width: "70%",
            height: "70%"
          },
          colors: ['"' + tcolor + '"', '"' + hcolor + '"']
        };

        var code = new google.visualization.AreaChart(document.getElementById('chart_div'));
        return code.draw(data, options);
      }
    };
    return areaChart();
  }

  function delay(t) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, 1000 * t);
    });
  }

  function max7219_horse(state, code) {
    var b = code.split("");
    var c;
    var d = [];
    if (code.length < 16) {
      for (var i = 0; i < (16 - code.length); i++) {
        code = code + "0";
      }
    }
    if (state == "left") {
      for (var i = 0; i < code.length / 2; i++) {
        c = b.splice(0, 2);
        b.push(c[0], c[1]);
        d[i] = b.join("");
        d[i] = d[i].split("").splice(0, 16).join("");
      }
    } else {
      for (var i = 0; i < code.length / 2; i++) {
        c = b.splice((code.length - 2), code.length);
        b.unshift(c[0], c[1]);
        d[i] = b.join("");
        d[i] = d[i].split("").splice(0, 16).join("");
      }
    }
    return d;
  }

  function max7219_alphabet(a) {
    var max7219_alphabet_object = {
      "A": "00fc262226fc",
      "a": "00f08888f880",
      "B": "00fe929292fc",
      "b": "00fe9090f0",
      "C": "007cc6828282",
      "c": "00f0909090",
      "D": "00fe8282c67c",
      "d": "00f09090fe",
      "E": "00fe92929292",
      "e": "00f8a8a8a8b8",
      "F": "00fe12121202",
      "f": "000008fe0a",
      "G": "00fe829292f2",
      "g": "0000bca4a4fc",
      "H": "00fe101010fe",
      "h": "00fe1010f0",
      "I": "008282fe8282",
      "i": "00f4",
      "J": "00828282fe02",
      "j": "000080f4",
      "K": "00fe10284482",
      "k": "00fe205088",
      "L": "00fe80808080",
      "l": "000000fe",
      "M": "00fe02fc02fe",
      "m": "00f010f010f0",
      "N": "00fe0c30c0fe",
      "n": "00f01010f0",
      "O": "007cc682c67c",
      "o": "00f09090f0",
      "P": "00fe2222223e",
      "p": "00fc24243c",
      "Q": "007cc6a246bc",
      "q": "003c2424fc80",
      "R": "00fe2262e2be",
      "r": "00f02010",
      "S": "009e929292f2",
      "s": "00b8a8a8e8",
      "T": "000202fe0202",
      "t": "0004fe84",
      "U": "00fe808080fe",
      "u": "00f08080f0",
      "V": "003e60c0603e",
      "v": "00708070",
      "W": "00fe80fe80fe",
      "w": "00f080f080f0",
      "X": "00c66c106cc6",
      "x": "008850205088",
      "Y": "000e18f0180e",
      "y": "00b8a0a0f8",
      "Z": "00c2a2928a86",
      "z": "00c8a8a898",
      "0": "00fe8282fe",
      "1": "0082fe80",
      "2": "00f292929e",
      "3": "00929292fe",
      "4": "001e1010fe",
      "5": "009e9292f2",
      "6": "00fe9292f2",
      "7": "00020202fe",
      "8": "00fe9292fe",
      "9": "009e9292fe",
      ":": "0028",
      ";": "008068",
      ".": "0080",
      ",": "008060",
      "-": "00101010",
      "_": "00808080",
      "~": "00201010202010",
      "\"": "000600060",
      "+": "0010107c1010",
      "/": "0080601804",
      "?": "000601b10906",
      "$": "005c54fe5474",
      "%": "00089468102c5220",
      "!": "00be",
      "<": "00102844",
      ">": "00442810",
      "(": "003c42",
      ")": "00423c",
      "[": "007e42",
      "]": "00427e",
      "*": "004830fc3048",
      "=": "00282828",
      "#": "00287c287c28",
      "@": "003844baaaba6458",
      " ": "00"
    };
    var text = "";
    if (a.length > 1) {
      for (var i = 0; i < a.length; i++) {
        text = text + max7219_alphabet_object[a[i]];
      }
    } else {
      text = max7219_alphabet_object[a];
    }
    var t = text.length;
    if (t < 16) {
      for (var i = 0; i < (16 - t); i++) {
        text = text + "0";
      }
    }
    return text;
  }

  function max7219_number(num) {
    var max7219_number_object = {
      "0": "0000fe8282fe0000",
      "1": "00000082fe800000",
      "2": "0000f292929e0000",
      "3": "0000929292fe0000",
      "4": "00001e1010fe0000",
      "5": "00009e9292f20000",
      "6": "0000fe9292f20000",
      "7": "0000020202fe0000",
      "8": "0000fe9292fe0000",
      "9": "00009e9292fe0000",
      "10": "82fe8000fe82fe00",
      "11": "82fe800082fe8000",
      "12": "82fe8000f2929e00",
      "13": "82fe80009292fe00",
      "14": "82fe80001e10fe00",
      "15": "82fe80009e92f200",
      "16": "82fe8000fe92f200",
      "17": "82fe80000202fe00",
      "18": "82fe8000fe92fe00",
      "19": "82fe80009e92fe00",
      "20": "f2929e00fe82fe00",
      "21": "f2929e0082fe8000",
      "22": "f2929e00f2929e00",
      "23": "f2929e009292fe00",
      "24": "f2929e001e10fe00",
      "25": "f2929e009e92f200",
      "26": "f2929e00fe92f200",
      "27": "f2929e000202fe00",
      "28": "f2929e00fe92fe00",
      "29": "f2929e009e92fe00",
      "30": "9292fe00fe82fe00",
      "31": "9292fe0082fe8000",
      "32": "9292fe00f2929e00",
      "33": "9292fe009292fe00",
      "34": "9292fe001e10fe00",
      "35": "9292fe009e92f200",
      "36": "9292fe00fe92f200",
      "37": "9292fe000202fe00",
      "38": "9292fe00fe92fe00",
      "39": "9292fe009e92fe00",
      "40": "1e10fe00fe82fe00",
      "41": "1e10fe0082fe8000",
      "42": "1e10fe00f2929e00",
      "43": "1e10fe009292fe00",
      "44": "1e10fe001e10fe00",
      "45": "1e10fe009e92f200",
      "46": "1e10fe00fe92f200",
      "47": "1e10fe000202fe00",
      "48": "1e10fe00fe92fe00",
      "49": "1e10fe009e92fe00",
      "50": "9e92f200fe82fe00",
      "51": "9e92f20082fe8000",
      "52": "9e92f200f2929e00",
      "53": "9e92f2009292fe00",
      "54": "9e92f2001e10fe00",
      "55": "9e92f2009e92f200",
      "56": "9e92f200fe92f200",
      "57": "9e92f2000202fe00",
      "58": "9e92f200fe92fe00",
      "59": "9e92f2009e92fe00",
      "60": "fe92f200fe82fe00",
      "61": "fe92f20082fe8000",
      "62": "fe92f200f2929e00",
      "63": "fe92f2009292fe00",
      "64": "fe92f2001e10fe00",
      "65": "fe92f2009e92f200",
      "66": "fe92f200fe92f200",
      "67": "fe92f2000202fe00",
      "68": "fe92f200fe92fe00",
      "69": "fe92f2009e92fe00",
      "70": "0202fe00fe82fe00",
      "71": "0202fe0082fe8000",
      "72": "0202fe00f2929e00",
      "73": "0202fe009292fe00",
      "74": "0202fe001e10fe00",
      "75": "0202fe009e92f200",
      "76": "0202fe00fe92f200",
      "77": "0202fe000202fe00",
      "78": "0202fe00fe92fe00",
      "79": "0202fe009e92fe00",
      "80": "fe92fe00fe82fe00",
      "81": "fe92fe0082fe8000",
      "82": "fe92fe00f2929e00",
      "83": "fe92fe009292fe00",
      "84": "fe92fe001e10fe00",
      "85": "fe92fe009e92f200",
      "86": "fe92fe00fe92f200",
      "87": "fe92fe000202fe00",
      "88": "fe92fe00fe92fe00",
      "89": "fe92fe009e92fe00",
      "90": "9e92fe00fe82fe00",
      "91": "9e92fe0082fe8000",
      "92": "9e92fe00f2929e00",
      "93": "9e92fe009292fe00",
      "94": "9e92fe001e10fe00",
      "95": "9e92fe009e92f200",
      "96": "9e92fe00fe92f200",
      "97": "9e92fe000202fe00",
      "98": "9e92fe00fe92fe00",
      "99": "9e92fe009e92fe00"
    };
    return max7219_number_object[num];
  }

  scope.boardReady = boardReady;
  scope.getPin = getPin;
  scope.getLed = getLed;
  scope.getRelay = getRelay;
  scope.getRGBLed = getRGBLed;
  scope.getRGBLedCathode = getRGBLedCathode;
  scope.getUltrasonic = getUltrasonic;
  scope.getButton = getButton;
  scope.getPullupButton = getPullupButton;
  scope.getPir = getPir;
  scope.getSound = getSound;
  scope.getShock = getShock;
  scope.getDht = getDht;
  scope.getBuzzer = getBuzzer;
  scope.getServo = getServo;
  scope.dhtAreaChart = dhtAreaChart;
  scope.delay = delay;
  scope.getMax7219 = getMax7219;
  scope.getPhotocell = getPhotocell;
  scope.getSoil = getSoil;
  scope.getIRRecv = getIRRecv;
  scope.getIRLed = getIRLed;
  scope.getADXL345 = getADXL345;
  scope.getJoystick = getJoystick;
  scope.getRFID = getRFID;
  scope.getToyCar = getToyCar;
  scope.setDeviceOrientationListener = setDeviceOrientationListener;
  scope.removeDeviceOrientationListener = removeDeviceOrientationListener;
  scope.setDeviceMotionListener = setDeviceMotionListener;
  scope.removeDeviceMotionListener = removeDeviceMotionListener;
  scope.konami = konami;
  scope.speak = speak;
  scope.speakSynth = speakSynth;
  scope.max7219_horse = max7219_horse;
  scope.max7219_alphabet = max7219_alphabet;
  scope.max7219_number = max7219_number;
  scope.boards = boards;

}));
