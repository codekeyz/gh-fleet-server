import "reflect-metadata";
import * as config from './config';
import {InversifyExpressServer} from 'inversify-express-utils';
import './mongoose';
import './firebase';
import '../controllers/user.controller';
import '../controllers/vehicle.controller'
import '../controllers/driver.controller'
import logger = require('morgan');
import bodyParser = require('body-parser');
import compress = require('compression');
import helmet = require('helmet');
import cors = require('cors');
import container = require('./di/container');

// create server
let server = new InversifyExpressServer(container, null, {rootPath: `/api/v${config.version}`});
server.setConfig(app => {

    if (config.env === 'development') {
        app.use(logger('dev'));
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.use(compress());

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());
});

// setup Error Middleware
server.setErrorConfig(app => {
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        return res.status(404).send('Requested route not found on this server');
    });

    // error handler, send stacktrace only during development
    app.use((err, req, res, next) => {
        res.status(err.status || 400).json({
            message: err.message
        });
        next(err);
    });
});

let app = server.build();

export = app;
