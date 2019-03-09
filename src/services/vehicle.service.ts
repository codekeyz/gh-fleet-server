import {injectable} from 'inversify';
import {IVehicle, vehicleModel as Vehicle} from '../models/vehicle.model';
import {IUser} from '../models/user.model';


@injectable()
export class VehicleService {

    public find = function (_id?, owner?) {
        let options = {};
        if (owner){
            options['owner'] = owner;
        }
        if (_id) {
            options['_id'] = _id;
        }
        return Vehicle.find(options);
    };

    public createVehicle = function (user: IUser, data: IVehicle) {
        data.owner = user;
        let vh = new Vehicle(data);
        return vh.save()
    }

    public updateVehicle = function (query: {}, update: {}) {
        return Vehicle.findOneAndUpdate(query, update, {
            new: true,
        });
    }
}

