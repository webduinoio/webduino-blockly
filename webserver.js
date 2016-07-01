var ONE_DAY = 86400000;

var express = require('express'),
  compress = require('compression'),
  http = require('http');

var app, server, port;

function setup() {
  app = express();
  app.use(compress());
  app.disable('x-powered-by');
  server = http.createServer(app);
}

function routes() {
  app.use('/', express.static(__dirname, {
    maxAge: ONE_DAY
  }));
}

function startup() {
  if (isNaN(port = parseInt(process.argv[2]))) {
    port = 8080;
  }
  server.listen(port);
  console.log('server listening on port: ' + port);
}

setup();
routes();
startup();
