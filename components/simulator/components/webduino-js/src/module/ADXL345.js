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

  var ADXL345Event = {
    MESSAGE: 'message'
  };

  function ADXL345(board) {
    Module.call(this);
    this._board = board;
    this._baseAxis = 'z';
    this._sensitive = 10;
    this._detectTime = 50;
    this._messageHandler = onMessage.bind(this);
    this._init = false;
    this._info = {
      x: 0,
      y: 0,
      z: 0,
      fXg: 0,
      fYg: 0,
      fZg: 0
    };
    this._callback = function() {};
    this._board.send([0xf0, 0x04, 0x0b, 0x00, 0xf7]);
  }

  function onMessage(event) {
    var msg = event.message;
    var msgPort = [0x04, 0x0b, 0x04];
    var stus = true;
    var alpha = 0.5;
    var x, y, z;

    if (msg.length !== 9) {
      return false;
    }

    msgPort.forEach(function(val, idx, ary) {
      if (val !== msg[idx]) {
        stus = false;
      }
    });

    if (!stus) {
      return false;
    }

    x = (msg[3] << 8 | msg[4]) - 1024;
    y = (msg[5] << 8 | msg[6]) - 1024;
    z = (msg[7] << 8 | msg[8]) - 1024;

    this.emit(ADXL345Event.MESSAGE, x, y, z);
  }

  function calcFixed(base, data, fixedInfo) {
    Object.getOwnPropertyNames(data).forEach(function(key, idx, ary) {
      fixedInfo[key] = data[key];

      if (key === base) {
        if (data[key] > 0) {
          fixedInfo[key] = data[key] - 256;
        } else {
          fixedInfo[key] = data[key] + 256;
        }
      }
    });
  }

  function estimateRollandPitch(x, y, z, fXg, fYg, fZg) {
    var alpha = 0.5;
    var roll, pitch;

    // Low Pass Filter
    fXg = x * alpha + (fXg * (1.0 - alpha));
    fYg = y * alpha + (fYg * (1.0 - alpha));
    fZg = z * alpha + (fZg * (1.0 - alpha));

    // Roll & Pitch Equations
    roll  = (Math.atan2(-fYg, fZg) * 180.0) / Math.PI;
    pitch = (Math.atan2(fXg, Math.sqrt(fYg * fYg + fZg * fZg)) * 180.0) / Math.PI;
    roll = roll.toFixed(2);
    pitch = pitch.toFixed(2);

    return {
      roll: roll,
      pitch: pitch,
      fXg: fXg,
      fYg: fYg,
      fZg: fZg
    };
  }

  ADXL345.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: ADXL345
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    var _this = this;

    this._board.send([0xf0, 0x04, 0x0b, 0x01, 0xf7]);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(x, y, z) {
      var info = _this._info;
      var rt;

      if (!_this._init) {
        _this._init = true;
        calcFixed(this._baseAxis, {x:x, y:y, z:z}, info);
      }

      x -= info.x;
      y -= info.y;
      z -= info.z;

      rt = estimateRollandPitch(x, y, z, info.fXg, info.fYg, info.fZg);
      ['fXg', 'fYg', 'fZg'].forEach(function(val, idx, ary) {
        info[val] = rt[val];
      });

      // uint : mg -> g
      x = (x / 256).toFixed(2);
      y = (y / 256).toFixed(2);
      z = (z / 256).toFixed(2);

      callback(x, y, z, rt.roll, rt.pitch);
    };

    this._state = 'on';
    this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.addListener(ADXL345Event.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.send([0xf0, 0x04, 0x0b, 0x02, 0xf7]);
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.removeListener(ADXL345Event.MESSAGE, this._callback);
    this._callback = null;
  };

  proto.refresh = function() {
    this._init = false;
    if (this._init === true) {
      this._info = {
        x: 0,
        y: 0,
        z: 0,
        fXg: 0,
        fYg: 0,
        fZg: 0
      };
    }
  };

  proto.setBaseAxis = function(val) {
    this._baseAxis = val;
  };

  proto.setSensitivity = function(sensitive) {
    if (sensitive !== this._sensitive) {
      this._sensitive = sensitive;
      this._board.send([0xf0, 0x04, 0x0b, 0x03, sensitive, 0xf7]);
    }
  };

  proto.setDetectTime = function(detectTime) {
    if (detectTime !== this._detectTime) {
      this._detectTime = detectTime;
      this._board.send([0xf0, 0x04, 0x0b, 0x04, detectTime, 0xf7]);
    }
  };

  scope.module.ADXL345 = ADXL345;
}));