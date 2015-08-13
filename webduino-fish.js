function getFish(board) {
  return new Fish(board);
}

function Fish(board) {
  this._board = board;
  this._pins = [];
  var self = this;
  [0, 2, 4, 5, 12, 13, 14, 15].forEach(function (val) {
    var pin = new webduino.module.Led(board, board.getDigitalPin(val));
    self._pins.push(pin);
  });
}

Fish.prototype.soar = function (secs) {
  var self = this;
  return new Promise(function (resolve, reject) {
    self._pins[0].off();
    self._pins[1].off();
    self._pins[2].on();
    self._pins[3].on();
    setTimeout(function () {
      self._pins[0].off();
      self._pins[1].off();
      self._pins[2].off();
      self._pins[3].off();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.sink = function (secs) {
  var self = this;
  return new Promise(function (resolve, reject) {
    self._pins[0].on();
    self._pins[1].on();
    self._pins[2].off();
    self._pins[3].off();
    setTimeout(function () {
      self._pins[0].off();
      self._pins[1].off();
      self._pins[2].off();
      self._pins[3].off();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.flap = function (secs, speed, direction) {
  var lSpeed, rSpeed, self = this;

  if (isNaN(speed = parseInt(speed))) {
    speed = 1;
  }

  switch (direction) {
  case 1:
    lSpeed = 2 * speed;
    rSpeed = speed;
    break;
  case 2:
    lSpeed = speed;
    rSpeed = 2 * speed;
    break;
  default:
    lSpeed = rSpeed = speed;
    break;
  }

  return new Promise(function (resolve, reject) {
    var flapping = true;

    _flap(function () {
      resolve();
    });

    setTimeout(function () {
      flapping = false;
    }, 1000 * secs);

    function _flap(callback) {
      if (flapping) {
        self._pins[4].on();
        self._pins[5].on();
        self._pins[6].off();
        self._pins[7].off();
        setTimeout(function () {
          if (flapping) {
            self._pins[4].off();
            self._pins[5].off();
            self._pins[6].on();
            self._pins[7].on();
            setTimeout(function () {
              _flap(callback);
            }, 1000 / rSpeed);
          } else {
            self._pins[4].off();
            self._pins[5].off();
            self._pins[6].off();
            self._pins[7].off();
            callback();
          }
        }, 1000 / lSpeed);
      } else {
        self._pins[4].off();
        self._pins[5].off();
        self._pins[6].off();
        self._pins[7].off();
        callback();
      }
    }
  });
};
