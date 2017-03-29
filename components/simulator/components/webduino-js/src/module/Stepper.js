+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var StepperEvent = {
    MESSAGE: 'message'
  };

  function Stepper(board, config) {
    Module.call(this);
    this._board = board;
    this._stepperNumber = Number(config.stepperNumber);
    this._interface = Number(config.interface);
    this._stepPerRevolution = Number(config.stepsPerRevolution);
    this._pin1 = Number(config.pin1);
    this._pin2 = Number(config.pin2);
    this._pin3 = Number(config.pin3);
    this._pin4 = Number(config.pin4);
    this._messageHandler = onMessage.bind(this);

    var val = transferNumber(this._stepPerRevolution, 2);
    var cmd = [].concat(0xF0, 0x72, 0x00, this._stepperNumber, this._interface, val, this._pin1, this._pin3, this._pin2, this._pin4, 0xF7);
    this._board.send(cmd);
  }

  function onMessage(event) {
    var msg = event.message;

    if (msg[0] !== Number(0x72)) {
      return false
    }

    this.emit(StepperEvent.MESSAGE, { status: true, stepperNumber: msg[1] });
  }

  // 2048 => [0, 16] => [0x00, 0x10]
  function transferNumber(value, num) {
    var str = value.toString(2);
    var ary = [];
    var end = str.length;
    var start;

    for (var i = 1; i < num + 1; i++) {
      start = -7 * i;
      ary.push(str.slice(start, end));
      end = start;
    }

    ary.forEach(function(val, idx, target) {
      val = parseInt(val, 2);
      val > 0 || (val = 0);
      target[idx] = val;
    });
    return ary;
  }

  Stepper.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Stepper
    }
  });

  proto.on = function(command, callback) {
    var _this = this;

    var stepperNumber = Number(command.stepperNumber) || 0;
    var direction = Number(command.direction) || 0;
    var stepNumber = Number(command.stepNumber) || 0;
    var speed = Number(command.speed) || 10;
    var speedAry = [];
    var stepNumberAry = [];
    var cmd;

    speedAry = transferNumber(speed, 2);
    stepNumberAry = transferNumber(stepNumber, 3);
    cmd = [].concat(0xF0, 0x72, 0x01, stepperNumber, direction, stepNumberAry, speedAry, 0xF7);

    this._board.send(cmd);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(val) {
      _this.off();
      callback(val);
    };

    this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.addListener(StepperEvent.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.removeListener(StepperEvent.MESSAGE, this._callback);
    this._callback = null;
  };

  scope.module.Stepper = Stepper;
}));
