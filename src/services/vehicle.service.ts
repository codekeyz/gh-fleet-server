import {injectable} from 'inversify';
import {IVehicle, vehicleModel as Vehicle} from '../models/vehicle.model';
import {IUser} from '../models/user.model';
import {imageModel as Image} from '../models/image.model';

@injectable()
export class VehicleService {

    public find = function (_id?, owner?, fuel_volume_units?, vehicle_type_name?, archived = false) {
        let options = {archived};
        if (owner) {
            options['owner'] = owner;
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

    public setImageforVehicle = async function (doc: IVehicle, data: {link: string, name: string}) {
        let im = new Image(data);
        doc.images.push(im);
        return doc.save();
    };

    public deleteVehicle = function (query: {}) {
        return Vehicle.findOneAndRemove(query);
    }
}

