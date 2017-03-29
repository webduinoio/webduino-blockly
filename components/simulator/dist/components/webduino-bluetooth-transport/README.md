# webduino-bluetooth-transport
Bluetooth Transport Plugin for webduino-js

## Prerequisite
When running in browser, you must have the following installed:

1. [API Proxy for Google Chrome™](https://chrome.google.com/webstore/detail/api-proxy-for-google-chro/pddlkidaibpbhpkfbhkbeolbagpmkhhn) (launch before opening your application)
2. [API Proxy Agent for Google Chrome™](https://chrome.google.com/webstore/detail/api-proxy-agent-for-googl/kdhdgaemffmpfmceolgbfpnfiafbjdkp)

to interface with Webduino/Arduino via Bluetooth.

## Installation
### Browser
_See also:_
[webduino-js](https://github.com/webduinoio/webduino-js)

The webduino-base.js or webduino-all.js has bundled serial and bluetooth transports by default. If you have successfully built it or use the CDN version, you are ready to go.

### Cordova
Using [bower](http://bower.io):
```sh
$ bower install webduinoio/webduino-bluetooth-transport
```

In project directory:
```sh
$ cordova plugin add cordova-plugin-bluetooth-serial
```

Insert script _after_ webduino-base.js (or webduino-all.js):
```html
<script src="bower_components/webduino-js/dist/webduino-base.js"></script>
<script src="bower_components/webduino-bluetooth-transport/src/CordovaBluetoothTransport.js"></script>
<script src="bower_components/webduino-js/src/module/Led.js"></script>
... (modules used)
```

### Node.js
```sh
$ npm install webduino-bluetooth-transport
```

## Usage
**webduino-js** provides isomorphic APIs:

```javascript
// need to acquire 'webduino' in Node.js:
// var webduino = require('webduino-js');

var board, led;

board = new webduino.Arduino({
  transport: 'bluetooth',
  address: 'xx:xx:xx:xx:xx:xx'
});

// Or:
// board = new webduino.Arduino({
//   transport: require('webduino-bluetooth-transport'),
//   address: 'xx:xx:xx:xx:xx:xx'
// });

board.on('ready', function() {
  led = new webduino.module.Led(board, board.getDigitalPin(10));
  led.on();
});
```

## [License](LICENSE)