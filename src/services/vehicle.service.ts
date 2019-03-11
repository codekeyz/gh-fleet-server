import {injectable} from 'inversify';
import {IVehicle, vehicleModel as Vehicle} from '../models/vehicle.model';
import {IUser} from '../models/user.model';


@injectable()
export class VehicleService {

    public find = function (_id?, owner?, color?, fuel_volume_units?, vehicle_type_name?, archived = false) {
        let options = {archived};
        if (owner) {
            options['owner'] = {'$regex': owner, $options: 'i'};
        }
        if (color) {
            options['color'] = {'$regex': color, $options: 'i'};
        }
        if (_id) {
            options['_id'] = _id;
        }
        if (fuel_volume_units) {
            options['fuel_volume_units'] = {'$regex': fuel_volume_units, $options: 'i'};
        }
        if (vehicle_type_name) {
            options['vehicle_type_name'] = {'$regex': vehicle_type_name, $options: 'i'};
        }
        return Vehicle.find(options);
    };

    public findOneByQuery = function (query: {}) {
        return Vehicle.findOne(query);
    };

    public createVehicle = function (user: IUser, data: IVehicle) {
        data.owner = user;
        let vh = new Vehicle(data);
        return vh.save()
    };

    public updateVehicle = function (query: {}, update: {}) {
        return Vehicle.findOneAndUpdate(query, update, {
            new: true,
        });
    };

    public deleteVehicle = function (query: {}) {
        return Vehicle.findOneAndRemove(query);
    }
}

