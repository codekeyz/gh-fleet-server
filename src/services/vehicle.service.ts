import {injectable} from 'inversify';
import {IVehicle, vehicleModel as Vehicle} from '../models/vehicle.model';


@injectable()
export class VehicleService {

    public getVehicles = function (options: {}) {

    }

    public createVehicle = function (data: IVehicle) {
        let vh = new Vehicle(data);
        return vh.save()
    }
}

