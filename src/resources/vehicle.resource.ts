import {IVehicle} from '../models/vehicle.model';
import BaseSanitizer = require('./base.sanitizer');

class VehicleResource implements BaseSanitizer<IVehicle> {

    public collection(datalist: IVehicle[]) {
        return this.handleCollection(datalist);
    }

    public single(data: IVehicle, wrap = true): {} {
        let result =
            {
                id: data._id,
                name: data.name,
                color: data.color,
                archived: data.archived,
                license_plate: data.license_plate,
                fuel_volume_units: data.fuel_volume_units,
                vehicle_type_model: data.vehicle_type_model,
                vehicle_type_name: data.vehicle_type_name,
                owner: {
                    username: data.owner.username,
                    email: data.owner.email,
                    telephone: data.owner.telephone
                },
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            };
        return wrap === true ? {data: result} : result;
    }

    private async handleCollection(datalist: IVehicle[]) {
        let result = [];
        let opts = datalist.map(vehicle => {
            result.push(this.single(vehicle, false))
        });
        await Promise.all(opts);
        return {
            data: result
        };
    }
}

export = new VehicleResource();