import {controller, httpGet} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../config/di/types';
import {NextFunction, Request, Response} from 'express';
import {VehicleService} from '../services/vehicle.service';

@controller('/vehicles')
export class VehicleController {

    constructor(@inject(TYPES.VehicleService) private vehicleSvc: VehicleService) {

    }

    @httpGet('*')
    private index(req: Request, res: Response, next: NextFunction): string {
        return 'Hello world';
    }


}