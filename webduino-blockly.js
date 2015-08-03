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

Blockly.JavaScript.addReservedWords('Car');

function promisifyCode(block, code) {
  var prev = block.getParent(),
    next = block.getNextBlock(),
    type, ocurr, count;

  if (prev !== null && prev.promise && prev.getNextBlock() === block) {
    count = 0;
    ocurr = code.match(/\n/g).length;
    code = code.replace(/\n/g, function () {
      count++;
      if (count < ocurr) {
        return '\n  ';
      }
      return '\n';
    });
    code = '.then(function () {\n  ' + (block.hasReturnValue_ ? 'return ' : '') + code + '})';
    block.promise = true;
    type = 1;
  } else {
    if (block.promise && code.endsWith(';\n') && next !== null) {
      code = code.substr(0, code.length - 2);
      type = 2;
    }
  }

  if (block.promise && next === null) {
    if (type) {
      code += ';\n';
    }
  }

  return code;
}

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

Blockly.JavaScript.blockToCode = function (block) {
  if (!block) {
    return '';
  }
  if (block.disabled) {
    // Skip past this block if it is disabled.
    return this.blockToCode(block.getNextBlock());
  }

  var func = this[block.type];
  goog.asserts.assertFunction(func,
    'Language "%s" does not know how to generate code for block type "%s".',
    this.name_, block.type);

  delete block.promise;

  // First argument to func.call is the value of 'this' in the generator.
  // Prior to 24 September 2013 'this' was the only way to access the block.
  // The current prefered method of accessing the block is through the second
  // argument to func.call, which becomes the first parameter to the generator.
  var code = func.call(block, block);
  if (goog.isArray(code)) {
    // Value blocks return tuples of code and operator order.

    // debug('CODE', code[0]);
    Blockly.JavaScript.depth++;
    var scrub = this.scrub_(block, code[0]);
    Blockly.JavaScript.depth--;
    // debug('<- ' + scrub);

    return [scrub, code[1]];
  } else if (goog.isString(code)) {
    if (this.STATEMENT_PREFIX) {
      code = this.STATEMENT_PREFIX.replace(/%1/g, '\'' + block.id + '\'') +
        code;
    }

    // var prev = block.getParent();
    // debug({
    //   type: block.type,
    //   depth: Blockly.JavaScript.depth,
    //   promise: block.promise,
    //   prev: prev ? prev.type : null
    // });
    code = promisifyCode(block, code);

    // debug('CODE', code);
    Blockly.JavaScript.depth++;
    var scrub = this.scrub_(block, code);
    Blockly.JavaScript.depth--;
    // debug('<- ' + scrub);

    return scrub;
  } else if (code === null) {
    // Block has handled code generation itself.
    return '';
  } else {
    goog.asserts.fail('Invalid code generated: %s', code);
  }
};

function debug() {
  var space = '';
  for (var i = 0; i < Blockly.JavaScript.depth; i++) {
    space += '  ';
  }
  console.log.apply(console, [space].concat(Array.prototype.slice.apply(arguments)));
}

Blockly.Block.prototype.setPromise = function (isPromise) {
  var block;
  this.promise = isPromise;
  if (isPromise) {
    while ((block = this.getSurroundParent()) !== null) {
      if (block.type.indexOf('procedures_def') === 0) {
        block.promise = true;
        return;
      }
    }
  }
};

Blockly.JavaScript.depth = 0;

var _proc_callnoreturn = Blockly.JavaScript['procedures_callnoreturn'];

Blockly.JavaScript['procedures_callnoreturn'] = function (block) {
  var funcName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var code = _proc_callnoreturn.call(Blockly.JavaScript, block);
  var blocks = Code.workspace.getTopBlocks();
  var blk;
  for (var i = 0; i < blocks.length; i++) {
    blk = blocks[i];
    if (blk.type.indexOf('procedures_def') === 0 && blk.getProcedureDef()[0] === funcName) {
      if (blk.promise) {
        block.promise = true;
      }
      break;
    }
  }
  return code;
};
