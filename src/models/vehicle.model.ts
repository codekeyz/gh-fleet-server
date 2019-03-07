import { Document, model as MongooseModel, Schema} from 'mongoose';

export interface IVehicle extends Document {
    name: string;
    color: string;
    license_plate: string;
    fuel_volume_units: string;
    vehicle_type_model: string;
    vehicle_type_name: string;
    createdAt: Date;
    updatedAt: Date;
}

export const VehicleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    license_plate: {
        type: String
    },
    fuel_volume_units: {
        type: String,
        required: true,
        enum: [
            'us_gallons',
            'uk_gallons',
            'liters'
        ]
    },
    vehicle_type_model: {
        type: String
    },
    vehicle_type_name: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export const vehicleModel = MongooseModel<IVehicle>('Vehicle', VehicleSchema);

export const cleanCollection = () => vehicleModel.remove({}).exec();

export default vehicleModel;