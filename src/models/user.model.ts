import {Document, model as MongooseModel, Schema} from 'mongoose';
import {IVehicle} from './vehicle.model';

export interface IUser extends Document {
    _id: string,
    email: string;
    username: string;
    telephone: string;
    createdAt: Date;
    updatedAt: Date;
    vehicles: IVehicle[]
}

export const UserSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    telephone: {
        type: String,
        match: [/^[1-9][0-9]{9}$/]
    },
    vehicles: [{type: Schema.Types.ObjectId, ref: 'Vehicle'}]
}, {
    versionKey: false,
    timestamps: true,
    _id: false
});

export const userModel = MongooseModel<IUser>("User", UserSchema);

export const cleanCollection = () => userModel.remove({}).exec();

export default userModel;