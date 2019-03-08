import {IVehicle} from '../models/vehicle.model';
import BaseSanitizer = require('./base.sanitizer');

class VehicleResource implements BaseSanitizer<IVehicle> {

    public collection(datalist: IVehicle[]) {
        return this.handleCollection(datalist);
    }

    public single(data: IVehicle, wrap?: boolean): {} {
        let result =
            {
                id: data._id,
                name: data.name,
                color: data.color,
                license_plate: data.license_plate,
                fuel_volume_units: data.fuel_volume_units,
                vehicle_type_model: data.vehicle_type_model,
                vehicle_type_name: data.vehicle_type_name,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            };
        return wrap === true ? {data: result} : result;
    }

    private async handleCollection(datalist: IVehicle[]) {
        let result = [];
        let opts = datalist.map(vehicle => {
            result.push(this.single(vehicle))
        });
        await Promise.all(opts);
        return {
            data: result
        };
    }
}

export = new VehicleResource();