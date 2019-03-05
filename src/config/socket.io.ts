import * as app from './express';
var http = require('http').Server(app);
let io = require('socket.io')(http);

export = http;
