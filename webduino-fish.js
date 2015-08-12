function getFish(board) {
  return new Fish(board);
}

function Fish(board) {
  this._board = board;
  this._pins = [];
  this._timer = null;
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

Fish.prototype.left = function (secs, speed) {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._timer) {
      self.stop();
    }

    self.flap('left', speed);
    setTimeout(function () {
      self.stop();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.right = function (secs, speed) {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._timer) {
      self.stop();
    }

    self.flap('right', speed);
    setTimeout(function () {
      self.stop();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.move = function (secs, speed) {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._timer) {
      self.stop();
    }

    self.flap(speed);
    setTimeout(function () {
      self.stop();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.flap = function (direction, speed) {
  var lSpeed, rSpeed, self = this;

  if (isNaN(speed = parseInt(speed))) {
    if (isNaN(speed = parseInt(direction))) {
      speed = 1;
    }
  }

  switch (direction) {
  case 'left':
    lSpeed = 2 * speed;
    rSpeed = speed;
    break;
  case 'right':
    lSpeed = speed;
    rSpeed = 2 * speed;
    break;
  default:
    lSpeed = rSpeed = speed;
    break;
  }

  self._pins[4].on();
  self._pins[5].on();
  self._pins[6].off();
  self._pins[7].off();
  self._timer = setTimeout(function () {
    self._pins[4].off();
    self._pins[5].off();
    self._pins[6].on();
    self._pins[7].on();
    self._timer = setTimeout(function () {
      if (self._timer) {
        self.flap(direction, speed);
      }
    }, 1000 / lSpeed);
  }, 1000 / rSpeed);
};

Fish.prototype.stop = function () {
  if (this._timer) {
    clearTimeout(this._timer);
    delete this._timer;
    this._pins[4].off();
    this._pins[5].off();
    this._pins[6].off();
    this._pins[7].off();
  }
};
