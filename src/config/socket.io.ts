import * as app from './express';

const http = require('http').Server(app);
const io = require('socket.io')(http);

export = http;
