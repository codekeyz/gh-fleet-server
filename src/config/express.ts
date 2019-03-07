import "reflect-metadata";
import TYPES from './di/types';
import * as config from './config';
import {Container} from 'inversify';
import {UserService} from '../services/user.service';
import {InversifyExpressServer} from 'inversify-express-utils';
import '../controllers/user.controller';
import '../controllers/vehicle.controller'
import '../controllers/driver.controller'
import logger = require('morgan');
import bodyParser = require('body-parser');
import compress = require('compression');
import helmet = require('helmet');
import cors = require('cors');
import httpError = require('http-errors');
import passport = require('passport');
import {DriverService} from '../services/driver.service';
import {VehicleService} from '../services/vehicle.service';

// load everything needed to the Container
let container = new Container();
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<DriverService>(TYPES.DriverService).to(DriverService);
container.bind<VehicleService>(TYPES.VehicleService).to(VehicleService);

// set up bindings
container.bind<UserService>('UserService').to(UserService);

// create server
let server = new InversifyExpressServer(container);
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

    // Setup passport
    app.use(passport.initialize());
});

// setup Error Middleware
server.setErrorConfig(app => {
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = httpError(404);
        return next(err);
    });

    // error handler, send stacktrace only during development
    app.use((err, req, res, next) => {
        // customize Joi validation errors
        if (err.isJoi) {
            err.message = err.details.map(e => e.message).join('; ');
            err.status = 400;
        }

        res.status(err.status || 500).json({
            message: err.message
        });
        next(err);
    });
});

let app = server.build();

export = app;
