import {controller, httpGet, queryParam} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../config/di/types';
import {Request, Response} from 'express';
import {VehicleService} from '../services/vehicle.service';
import vehicleResource = require('../resources/vehicle.resource');

@controller('/vehicles')
export class VehicleController {

    constructor(@inject(TYPES.VehicleService) private _vhSvc: VehicleService) {
    }

    @httpGet('/')
    private async index(
        @queryParam('color') color: string,
        @queryParam('fuel_volume_units') fuel_volume_units: string,
        @queryParam('vehicle_type_name') vehicle_type_name: string,
        @queryParam('archived') archived: boolean,
        @queryParam('offset') offset = `${0}`,
        @queryParam('limit') lim = `${50}`,
        req: Request,
        res: Response) {
        const limit = parseInt(lim) > 50 ? 50 : parseInt(lim);
        try {
            const result = await this._vhSvc.find(null, null, fuel_volume_units, vehicle_type_name, archived)
                .skip(parseInt(offset))
                .limit(limit)
                .populate('owner')
                .exec();
            const formattedresult = await vehicleResource.collection(result);
            res.send(formattedresult);
        } catch (e) {
            res.status(400).send(e);
        }
    }
}