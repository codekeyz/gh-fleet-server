import {Document, model as MongooseModel, Schema} from 'mongoose';
import {IUser} from './user.model';
import {IImage, imageSchema} from './image.model';

export interface IVehicle extends Document {
    _id: string,
    name: string;
    owner: IUser;
    images: IImage[],
    archived: boolean,
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
    license_plate: {
        type: String
    },
    archived: {
        type: Boolean,
        default: false
    },
    fuel_volume_units: {
        type: String,
        required: true,
        enum: [
            'us_gallons',
            'uk_gallons',
            'litres'
        ]
    },
    vehicle_type_model: {
        type: String
    },
    vehicle_type_name: {
        type: String,
        required: true
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [imageSchema]
}, {
    versionKey: false,
    timestamps: true
});

export const vehicleModel = MongooseModel<IVehicle>('Vehicle', VehicleSchema);

export const cleanCollection = () => vehicleModel.remove({}).exec();

export default vehicleModel;