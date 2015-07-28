function boardReady(device, callback) {
  var board = new webduino.WebArduino(device);
  board.on(webduino.BoardEvent.READY, callback.bind(null, board));
}

function getLed(board, pin) {
  return new webduino.module.Led(board, board.getDigitalPin(pin));
}
