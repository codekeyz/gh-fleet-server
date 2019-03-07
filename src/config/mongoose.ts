import mongoose = require('mongoose');
const debug = require('debug')('my-app:my-module');
import util = require('util');


import * as config from './config';

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(config.mongodb.host, { keepAlive: true, useNewUrlParser: true });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongodb.host}`);
});

if (config.mongodb.debug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

