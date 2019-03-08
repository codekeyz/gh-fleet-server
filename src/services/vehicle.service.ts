import {injectable} from 'inversify';
import {IVehicle, vehicleModel as Vehicle} from '../models/vehicle.model';


@injectable()
export class VehicleService {

    public getVehicleByOwnerId = function (owner: string) {
        return Vehicle.find({owner})
            .populate('owner')
            .exec();
    };

    public createVehicle = function (data: IVehicle) {
        let vh = new Vehicle(data);
        return vh.save()
    }
}

