# webduino-serial-transport
Serialport Transport Plugin for webduino-js

## Prerequisite
When running in browser, you must have the following installed:

1. [API Proxy for Google Chrome™](https://chrome.google.com/webstore/detail/api-proxy-for-google-chro/pddlkidaibpbhpkfbhkbeolbagpmkhhn) (launch before opening your application)
2. [API Proxy Agent for Google Chrome™](https://chrome.google.com/webstore/detail/api-proxy-agent-for-googl/kdhdgaemffmpfmceolgbfpnfiafbjdkp)

to interface with Webduino/Arduino via Serialport.

## Installation
### Browser
_See also:_
[webduino-js](https://github.com/webduinoio/webduino-js)

The webduino-base.js or webduino-all.js has bundled serial and bluetooth transports by default. If you have successfully built it or use the CDN version, you are ready to go.

### Node.js
```sh
$ npm install webduino-serial-transport
```

## Usage
**webduino-js** provides isomorphic APIs:

```javascript
// need to acquire 'webduino' in Node.js:
// var webduino = require('webduino-js');

var board, led;

board = new webduino.Arduino({
  transport: 'serial',
  path: '/dev/cu.usbmodem1421'
});

// Or:
// board = new webduino.Arduino({
//   transport: require('webduino-serial-transport'),
//   path: '/dev/cu.usbmodem1421'
// });

board.on('ready', function() {
  led = new webduino.module.Led(board, board.getDigitalPin(10));
  led.on();
});
```

## [License](LICENSE)