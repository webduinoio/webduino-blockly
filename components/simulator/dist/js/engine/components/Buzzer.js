(function (scope) {
  'use strict';

  var uiCallback;

  function Buzzer(board, name, signal, gnd) {
    this._board = board;
    this._name = name;
    this._signal = signal;
    this._gnd = gnd;
    this._buf = [];
    this._ctx = new AudioContext();
    this._playing = false;

    var self = this;

    this._board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (sysex) {
      var data = sysex.message;
      var pin = data[2];
      if (data[0] != 4 || data[1] != 7 || pin != self._signal) {
        return;
      }
      var freq = parseInt(data[3]) * 100 + parseInt(data[4]);
      var time = parseInt(data[5]) * 100;
      self._buf.push([freq, time]);
      self.play();
    });
    this._board.on(webduino.BoardEvent.BEFOREDISCONNECT, this.destroy.bind(this));
    this._board.on(webduino.BoardEvent.ERROR, this.destroy.bind(this));
  }

  Buzzer.prototype = Object.create(Buzzer.prototype, {
    constructor: { value: Buzzer }
  });

  Buzzer.prototype.action = function (callback) {
    uiCallback = callback;
  }

  Buzzer.prototype.play = function () {
    this.osc = this._ctx.createOscillator();
    this.osc.type = "triangle";
    this.osc.start(0);

    if (this._playing) {
      return;
    }
    this._playing = true;
    var data = this._buf.shift();
    var hz = data[0];
    var durtime = data[1];
    console.log("hz:", hz, ",time:", durtime);
    this.osc.frequency.value = hz;
    this.osc.connect(this._ctx.destination);
    var self = this;
    setTimeout(function () {
      self.osc.disconnect();
      self._playing = false;
      if (self._buf.length > 0) {
        self.play();
      }
    }, durtime);
  }

  Buzzer.prototype.destroy = function () {
    this._ctx.close();
  };

  scope.Buzzer = Buzzer;
})(Engine);