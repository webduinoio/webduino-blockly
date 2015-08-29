+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(window);
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

function boardReady(device, callback) {
  var board = new webduino.WebArduino(device);
  board.on(webduino.BoardEvent.READY, callback.bind(null, board));
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
scope.getLed = getLed;
scope.getRelay = getRelay;
scope.getRGBLed = getRGBLed;
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

}));
