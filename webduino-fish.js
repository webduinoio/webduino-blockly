function getFish(board) {
  return new Fish(board);
}

function Fish(board) {
  this._board = board;
  this._pins = [];
  this._speed = 2;
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
    speed = speed || self._speed;
    self._speed = speed;
    self.flapLeft();
    setTimeout(function () {
      self.stopFlap();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.right = function (secs, speed) {
  var self = this;
  return new Promise(function (resolve, reject) {
    speed = speed || self._speed;
    self._speed = speed;
    self.flapRight();
    setTimeout(function () {
      self.stopFlap();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.move = function (secs, speed) {
  var self = this;
  return new Promise(function (resolve, reject) {
    speed = speed || self._speed;
    self._speed = speed;
    self.flap();
    setTimeout(function () {
      self.stopFlap();
      resolve();
    }, secs * 1000);
  });
};

Fish.prototype.flap = function () {
  var self = this;
  if (self._timer) {
    self.stopFlap();
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
        self.flap();
      }
    }, Fish.SPEED[self._speed]);
  }, Fish.SPEED[self._speed]);
};

Fish.prototype.flapRight = function () {
  var self = this;
  if (self._timer) {
    self.stopFlap();
  }
  self._pins[4].on();
  self._pins[5].on();
  self._pins[6].off();
  self._pins[7].off();
  self._timer = setTimeout(function () {
    self._pins[4].off();
    self._pins[5].off();
    self._pins[6].off();
    self._pins[7].off();
    self._timer = setTimeout(function () {
      if (self._timer) {
        self.flapRight();
      }
    }, Fish.SPEED[self._speed]);
  }, Fish.SPEED[self._speed]);
};

Fish.prototype.flapLeft = function () {
  var self = this;
  if (self._timer) {
    self.stopFlap();
  }
  self._pins[4].off();
  self._pins[5].off();
  self._pins[6].on();
  self._pins[7].on();
  self._timer = setTimeout(function () {
    self._pins[4].off();
    self._pins[5].off();
    self._pins[6].off();
    self._pins[7].off();
    self._timer = setTimeout(function () {
      if (self._timer) {
        self.flapLeft();
      }
    }, Fish.SPEED[self._speed]);
  }, Fish.SPEED[self._speed]);
};

Fish.prototype.stopFlap = function () {
  if (this._timer) {
    clearTimeout(this._timer);
    delete this._timer;
  }
};

Fish.SPEED = [1500, 900, 300];
