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

  function boardReady(options, callback) {
    var board;

    if (typeof options === 'string') {
      options = {
        device: options
      };
    }
    if (options.device) {
      board = new webduino.WebArduino(options);
    } else {
      board = new webduino.Arduino(options);
    }
    board.on(webduino.BoardEvent.READY, callback.bind(undef));

    boards.push(board);
  }

  function disconnectBoards(callback) {
    var promises = boards.map(whenClosed);
    Promise.all(promises).then(function (results) {
      boards = [];
      callback(results);
    }).catch(function (reason) {
      boards = [];
      callback(reason);
    });
  }

  function whenClosed(board) {
    return new Promise(function (resolve, reject) {
      try {
        if (board._transport.isOpen) {
          board.on(webduino.BoardEvent.DISCONNECT, function () {
            resolve(true);
          });
          board.disconnect();
        } else {
          resolve(true);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  function getBoards() {
    return boards;
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

  function setDeviceOrientationListener(listener) {
    removeDeviceOrientationListener();

    if (typeof listener === 'function') {
      orientationEventListener = function (event) {
        var alpha, beta, gamma;
        if (event.webkitCompassHeading) {
          alpha = event.webkitCompassHeading;
        } else {
          alpha = event.alpha;
          if (!window.chrome) {
            alpha = alpha - 270;
          }
        }
        beta = event.beta;
        gamma = event.gamma;
        listener.apply(this, [alpha, beta, gamma]);
      };

      window.addEventListener('deviceorientation', orientationEventListener);
    }
  }

  function removeDeviceOrientationListener() {
    window.removeEventListener('deviceorientation', orientationEventListener);
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

  function toyCar(board,RF,RB,LF,LB){
    this._rf = getPin(board, RF);
    this._rb = getPin(board, RB);
    this._lf = getPin(board, LF);
    this._lb = getPin(board, LB);
  }

  toyCar.prototype.goFront = function(){
      var self = this;
      self._rf.write(1);
      self._rb.write(0);
      self._lf.write(1);
      self._lb.write(0);
  };
  toyCar.prototype.goBack = function(){
      var self = this;
      self._rf.write(0);
      self._rb.write(1);
      self._lf.write(0);
      self._lb.write(1);
  };
  toyCar.prototype.goRight = function(){
      var self = this;
      self._rf.write(1);
      self._rb.write(0);
      self._lf.write(0);
      self._lb.write(0);
  };
  toyCar.prototype.goLeft = function(){
      var self = this;
      self._rf.write(0);
      self._rb.write(0);
      self._lf.write(1);
      self._lb.write(0);
  };
  toyCar.prototype.turnRight = function(){
      var self = this;
      self._rf.write(0);
      self._rb.write(1);
      self._lf.write(1);
      self._lb.write(0);
  };
  toyCar.prototype.turnLeft = function(){
      var self = this;
      self._rf.write(1);
      self._rb.write(0);
      self._lf.write(0);
      self._lb.write(1);
  };
  toyCar.prototype.backLeft = function(){
      var self = this;
      self._rf.write(0);
      self._rb.write(0);
      self._lf.write(0);
      self._lb.write(1);
  };
  toyCar.prototype.backRight = function(){
      var self = this;
      self._rf.write(0);
      self._rb.write(1);
      self._lf.write(0);
      self._lb.write(0);
  };
  toyCar.prototype.stop = function(){
      var self = this;
      self._rf.write(0);
      self._rb.write(0);
      self._lf.write(0);
      self._lb.write(0);
  };

  function getToyCar(board,RF,RB,LF,LB) {
    return new toyCar(board,RF,RB,LF,LB);
  }

  function getCar(board, F, B, L, R) {
    return new Car(board, F, B, L, R);
  }

  function Car(board, F, B, L, R) {
    this._board = board;
  }

  Car.prototype.forward = function (secs) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self._board.send([0x90, 0x00, 0x01, 0x91, 0x01, 0x00]);
      setTimeout(function () {
        self._board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, secs * 1000);
    });
  };

  Car.prototype.backward = function (secs) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self._board.send([0x90, 0x40, 0x00, 0x91, 0x02, 0x00]);
      setTimeout(function () {
        self._board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, secs * 1000);
    });
  };

  Car.prototype.left = function (secs) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self._board.send([0x90, 0x40, 0x00, 0x91, 0x01, 0x00]);
      setTimeout(function () {
        self._board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, secs * 1000);
    });
  };

  Car.prototype.right = function (secs) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self._board.send([0x90, 0x00, 0x01, 0x91, 0x02, 0x00]);
      setTimeout(function () {
        self._board.send([0x90, 0x00, 0x00, 0x91, 0x00, 0x00]);
        resolve();
      }, secs * 1000);
    });
  };

  Car.prototype.stop = function (secs) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, secs * 1000);
    });
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

  scope.boardReady = boardReady;
  scope.disconnectBoards = disconnectBoards;
  scope.getBoards = getBoards;
  scope.getPin = getPin;
  scope.getLed = getLed;
  scope.getRelay = getRelay;
  scope.getRGBLed = getRGBLed;
  scope.getRGBLedCathode = getRGBLedCathode;
  scope.getUltrasonic = getUltrasonic;
  scope.getButton = getButton;
  scope.getPir = getPir;
  scope.getSound = getSound;
  scope.getShock = getShock;
  scope.getDht = getDht;
  scope.getBuzzer = getBuzzer;
  scope.getServo = getServo;
  scope.getCar = getCar;
  scope.Car = Car;
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

}));
