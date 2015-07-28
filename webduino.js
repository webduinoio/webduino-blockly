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
