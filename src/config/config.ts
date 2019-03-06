import Joi = require('joi');
import {number} from "joi";
const packJson = require('../../package.json');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();



// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production'])
    .default('development'),
  SERVER_PORT: Joi.number().default(4040),
  MARIADB_HOST: Joi.string()
    .required()
    .description('Maria DB host url'),
  MARIADB_PORT: Joi.number().default(3306),
  API_VERSION: Joi.number().default(parseFloat(packJson.version).toPrecision(2))
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  jwtSecret: envVars.JWT_SECRET,
  version: envVars.API_VERSION,
  mariadb: {
    host: envVars.MARIADB_HOST,
    port: envVars.MARIADB_PORT
  }
};

export = config;
