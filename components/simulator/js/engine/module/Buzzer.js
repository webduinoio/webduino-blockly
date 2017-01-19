+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var util = scope.util,
    Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var BUZZER_MESSAGE = [0x04, 0x07],
    TONE_MIN_LENGTH = 100;

  var BUZZER_STATE = {
    PLAYING: 'playing',
    STOPPED: 'stopped',
    PAUSED: 'paused'
  };

  var FREQUENCY = {
    REST: 0,
    B0: 31,
    C1: 33,
    CS1: 35,
    D1: 37,
    DS1: 39,
    E1: 41,
    F1: 44,
    FS1: 46,
    G1: 49,
    GS1: 52,
    A1: 55,
    AS1: 58,
    B1: 62,
    C2: 65,
    CS2: 69,
    D2: 73,
    DS2: 78,
    E2: 82,
    F2: 87,
    FS2: 93,
    G2: 98,
    GS2: 104,
    A2: 110,
    AS2: 117,
    B2: 123,
    C3: 131,
    CS3: 139,
    D3: 147,
    DS3: 156,
    E3: 165,
    F3: 175,
    FS3: 185,
    G3: 196,
    GS3: 208,
    A3: 220,
    AS3: 233,
    B3: 247,
    C4: 262,
    CS4: 277,
    D4: 294,
    DS4: 311,
    E4: 330,
    F4: 349,
    FS4: 370,
    G4: 392,
    GS4: 415,
    A4: 440,
    AS4: 466,
    B4: 494,
    C5: 523,
    CS5: 554,
    D5: 587,
    DS5: 622,
    E5: 659,
    F5: 698,
    FS5: 740,
    G5: 784,
    GS5: 831,
    A5: 880,
    AS5: 932,
    B5: 988,
    C6: 1047,
    CS6: 1109,
    D6: 1175,
    DS6: 1245,
    E6: 1319,
    F6: 1397,
    FS6: 1480,
    G6: 1568,
    GS6: 1661,
    A6: 1760,
    AS6: 1865,
    B6: 1976,
    C7: 2093,
    CS7: 2217,
    D7: 2349,
    DS7: 2489,
    E7: 2637,
    F7: 2794,
    FS7: 2960,
    G7: 3136,
    GS7: 3322,
    A7: 3520,
    AS7: 3729,
    B7: 3951,
    C8: 4186,
    CS8: 4435,
    D8: 4699,
    DS8: 4978
  };

  function Buzzer(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;
    this._timer = null;
    this._sequence = null;
    this._state = BUZZER_STATE.STOPPED;

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.stop.bind(this));
    this._board.on(BoardEvent.ERROR, this.stop.bind(this));
  }

  function getDuration(duration) {
    duration = isNaN(duration = parseInt(duration)) ? TONE_MIN_LENGTH : duration;
    return Math.max(duration, TONE_MIN_LENGTH);
  }

  function padDurations(durations, len) {
    var durLen = durations.length,
      dur = durLen ? durations[durLen - 1] : TONE_MIN_LENGTH;

    if (durLen < len) {
      push.apply(durations, new Array(len - durLen));
      for (var i = durLen; i < durations.length; i++) {
        durations[i] = dur;
      }
    }

    return durations;
  }

  function playNext(self) {
    var seq = self._sequence,
      note;

    if (seq && seq.length > 0) {
      note = seq.pop();
      self.tone(note.frequency, note.duration);
      self._timer = setTimeout(function () {
        playNext(self);
      }, note.duration + Buzzer.TONE_DELAY);
    } else {
      self.stop();
    }
  }

  Buzzer.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Buzzer
    }
  });

  proto.tone = function (freq, duration) {
    var freqData = [];

    if (isNaN(freq = parseInt(freq)) || freq <= 0 || freq > 9999) {
      return;
    }

    freq = ('0000' + freq).substr(-4, 4);
    freqData[0] = parseInt('0x' + freq[0] + freq[1]);
    freqData[1] = parseInt('0x' + freq[2] + freq[3]);
    duration = Math.round(getDuration(duration) / TONE_MIN_LENGTH);
    this._board.sendSysex(BUZZER_MESSAGE[0], [BUZZER_MESSAGE[1], this._pin.number]
      .concat(freqData).concat(duration));
  };

  proto.play = function (notes, tempos) {
    if (typeof notes !== 'undefined') {
      var len = notes.length,
        durations = padDurations(
          (util.isArray(tempos) ? tempos : []).map(function (t) {
            return getDuration(1000 / t);
          }), len
        );

      this.stop();
      this._sequence = [];
      for (var i = len - 1; i >= 0; i--) {
        this._sequence.push({
          frequency: FREQUENCY[notes[i].toUpperCase()],
          duration: durations[i]
        });
      }
    } else {
      if (this._state === BUZZER_STATE.PLAYING) {
        return;
      }
    }

    this._state = BUZZER_STATE.PLAYING;
    playNext(this);
  };

  proto.pause = function () {
    if (this._state !== BUZZER_STATE.PLAYING) {
      return;
    }

    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }

    this._state = BUZZER_STATE.PAUSED;
  };

  proto.stop = function () {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }

    delete this._sequence;
    this._state = BUZZER_STATE.STOPPED;
  };

  Buzzer.FREQUENCY = FREQUENCY;

  Buzzer.TONE_DELAY = 60;

  scope.module.Buzzer = Buzzer;
}));
