(function (scope) {
  'use strict';

  var uiCallback;

  function Buzzer(board, name, signal, gnd) {
    window.b = board;
    this._name = name;
    this._gnd = gnd;
    this._board = board;
    this._signal = signal;
    this._buf = [];
    this.playing = false;
    this.ctx = new AudioContext();
    var self = this;
    board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (sysex) {
      var data = sysex.message;
      var pin = data[2];
      if (data[0] != 4 || data[1] != 7 || pin != self._signal) {
        return;
      }
      var freq = parseInt(data[3]) * 100 + parseInt(data[4]);
      var time = parseInt(data[5]) * 100;
      self._buf.push([freq, time]);
      self.play();
      //action(self, data.pin);
    });
  }

  function action(buzzer, pin) {
    if (pin._number != buzzer._signal) {
      return;
    }
    var jsonData = {
      action: {
        id: buzzer._board._options.device,
        type: buzzer._board.constructor.name,
        connector: [{
          name: buzzer._name,
          type: "Buzzer",
          intensity: pin._value
        }]
      }
    };
    uiCallback(jsonData);
  }


  Buzzer.prototype = Object.create(Buzzer.prototype, {
    constructor: { value: Buzzer }
  });

  Buzzer.prototype.action = function (callback) {
    uiCallback = callback;
  }

  Buzzer.prototype.play = function () {
    this.osc = this.ctx.createOscillator();
    this.osc.type = "triangle";
    this.osc.start(0);

    if (this.playing) {
      return;
    }
    this.playing = true;
    var data = this._buf.shift();
    var hz = data[0];
    var durtime = data[1];
    console.log("hz:", hz, ",time:", durtime);
    this.osc.frequency.value = hz;
    this.osc.connect(this.ctx.destination);
    var self = this;
    setTimeout(function () {
      self.osc.disconnect();
      self.playing = false;
      if (self._buf.length > 0) {
        self.play();
      }
    }, durtime);
  }

  scope.Buzzer = Buzzer;
})(Engine);