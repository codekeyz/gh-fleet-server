import express = require('express');
import helmet = require('helmet');
import logger = require('morgan');
import httpError = require('http-errors');
import compress = require('compression');
import cors = require('cors');
import bodyParser = require('body-parser');
import * as config from './config';
import * as routes from '../routes/index.routes';
import * as passport from '../config/passport';

const app = express();

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

// API router
app.use(`/api/v${config.version}`, routes);

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

export = app;
