function boardReady(device, callback) {
  var board = new webduino.WebArduino(device);
  board.on(webduino.BoardEvent.READY, callback.bind(null, board));
}

function getLed(board, pin) {
  return new webduino.module.Led(board, board.getDigitalPin(pin));
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

Blockly.JavaScript.addReservedWords('Car');

function getPreviousBlock(block) {
  if (block && block.previousConnection && block.previousConnection.targetConnection) {
    return block.previousConnection.targetConnection.sourceBlock_;
  }
  return null;
}

function getNextBlock(block) {
  if (block && block.nextConnection && block.nextConnection.targetConnection) {
    return block.nextConnection.targetConnection.sourceBlock_;
  }
  return null;
}

function promisifyBlockCode(block, code) {
  var prev = getPreviousBlock(block),
    next = getNextBlock(block);

  if (prev && prev.type === 'car_move') {
    code = '.then(function () {\n  return ' + code + ';\n})';
  }
  if (next === null || ['car_move', 'exec_then', 'exec_then_stms'].indexOf(next.type) === -1) {
    code += ';\n';
  }
  return code;
}
