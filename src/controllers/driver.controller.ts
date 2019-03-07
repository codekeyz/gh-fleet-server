import express = require('express');
import {controller, httpGet} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../config/di/types';
import {DriverService} from '../services/driver.service';

@controller('/drivers')
export class DriverController {

    constructor(@inject(TYPES.DriverService) private driverSvc: DriverService) {
    }

    @httpGet('*')
    public logme(req: express.Request, res: express.Response) {
        return this.driverSvc.getUsers();
    }
}
