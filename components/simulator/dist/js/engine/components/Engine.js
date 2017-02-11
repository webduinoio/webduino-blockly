(function (scope) {
  'use strict';

  var board, uiCallback;
  var createJSON = {};

  function Engine() {

  }

  function procConnector(connectorJSON) {
    var list = connectorJSON;
    for (var i = 0; i < list.length; i++) {
      if (list[i].type == 'Led') {
        var led = new Engine.Led(board, list[i].name, list[i].signal, list[i].gnd);
        led.action(uiCallback);
      } else if (list[i].type == 'Buzzer') {
        var buzzer = new Engine.Buzzer(board, list[i].name, list[i].signal, list[i].gnd);
        buzzer.action(uiCallback);
      } else if (list[i].type == 'Servo') {
        var servo = new Engine.Servo(board, list[i].name, list[i].signal, list[i].gnd);
        servo.action(uiCallback);
      } else if (list[i].type == 'RGBLed') {
        var rgbLed = new Engine.RGBLed(board, list[i].name, list[i].vcc, list[i].signalRed, list[i].signalGreen, list[i].signalBlue);
        rgbLed.action(uiCallback);
      } else if (list[i].type == 'Matrix') {
        var matrix = new Engine.Matrix(board, list[i].name, list[i].vcc, list[i].gnd, list[i].din, list[i].cs, list[i].clk);
        matrix.action(uiCallback);
      } else if (list[i].type == 'UltraSonic') {
        var ultraSonic = new Engine.UltraSonic(board, list[i].name, list[i].vcc, list[i].trig, list[i].echo, list[i].gnd);
        ultraSonic.action(uiCallback);
      }
    }
  }

  Engine.prototype = Object.create(Object.prototype, {
    constructor: {
      value: Engine
    }
  });

  Engine.prototype.stop = function (json, callback) {
    this.board.disconnect(callback);
  }

  Engine.prototype.start = function (json, callback) {
    var disconnectHandler = json.disconnect || function () {};
    createJSON = json.create;
    console.log("Engine start...");
    board = new webduino[createJSON.type](createJSON.id);
    board.begin();
    this.board = board;
    //
    board.on(webduino.BoardEvent.READY, function () {
      //PWM setting
      board.getDigitalPin(3).setMode(3 /*Pin.AOUT*/ );
      board.getDigitalPin(5).setMode(3 /*Pin.AOUT*/ );
      board.getDigitalPin(6).setMode(3 /*Pin.AOUT*/ );
      board.getDigitalPin(9).setMode(3 /*Pin.AOUT*/ );
      board.getDigitalPin(10).setMode(3 /*Pin.AOUT*/ );
      board.getDigitalPin(11).setMode(3 /*Pin.AOUT*/ );
      board.getDigitalPin(12).setMode(1 /*Pin.DOUT*/ );
      board.getDigitalPin(13).setMode(1 /*Pin.DOUT*/ );
      procConnector(createJSON.connector);
      callback();
    });
    board.on(webduino.BoardEvent.ERROR, function (err) {
      console.log('board error', err.message);
    });

    board.on(webduino.BoardEvent.BEFOREDISCONNECT, function () {
      console.log('board beforedisconnect');
    });

    board.on(webduino.BoardEvent.DISCONNECT, function () {
      console.log('board disconnect');
      // test: should not emit 'disconnect' again
      board.disconnect();
      disconnectHandler();
    });
  }

  Engine.prototype.action = function (callback) {
    uiCallback = callback;
  }

  scope.Engine = Engine;
})(window);