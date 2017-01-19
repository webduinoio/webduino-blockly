+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Led = scope.module.Led,
    Module = scope.Module,
    proto;

  function RGBLed(board, redLedPin, greenLedPin, blueLedPin, driveMode) {
    Module.call(this);

    if (driveMode === undefined) {
      driveMode = RGBLed.COMMON_ANODE;
    }

    this._board = board;
    this._redLed = new Led(board, redLedPin, driveMode);
    this._greenLed = new Led(board, greenLedPin, driveMode);
    this._blueLed = new Led(board, blueLedPin, driveMode);

    this.setColor(0, 0, 0);
  }

  function hexToR(h) {
    return parseInt(h.substring(0, 2), 16)
  }

  function hexToG(h) {
    return parseInt(h.substring(2, 4), 16)
  }

  function hexToB(h) {
    return parseInt(h.substring(4, 6), 16)
  }

  function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
  }

  RGBLed.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: RGBLed
    }
  });

  proto.setColor = function (red, green, blue, callback) {
    if (typeof green === 'undefined' || typeof green === 'function') {
      var color = cutHex(red);
      callback = green;
      red = hexToR(color);
      green = hexToG(color);
      blue = hexToB(color);
    }

    red = red / 255;
    green = green / 255;
    blue = blue / 255;

    this._redLed.intensity = red;
    this._greenLed.intensity = green;
    this._blueLed.intensity = blue;

    if (typeof callback === 'function') {
      var self = this,
        redPin = this._redLed._pin,
        greenPin = this._greenLed._pin,
        bluePin = this._blueLed._pin;

      this._board.queryPinState([redPin, greenPin, bluePin], function (pins) {
        if (pins[0].state === redPin.value &&
          pins[1].state === greenPin.value &&
          pins[2].state === bluePin.value) {
          callback.call(self);
        }
      });
    }
  };

  RGBLed.COMMON_ANODE = Led.SYNC_DRIVE;
  RGBLed.COMMON_CATHODE = Led.SOURCE_DRIVE;

  scope.module.RGBLed = RGBLed;
}));
