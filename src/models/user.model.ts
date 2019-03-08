import bcrypt = require('bcrypt');
import {Document, model as MongooseModel, Schema} from 'mongoose';
import {IVehicle} from './vehicle.model';

export interface IUser extends Document {
    email: string;
    username: string;
    telephone: string;
    createdAt: Date;
    updatedAt: Date;
    vehicles: IVehicle[],
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    telephone: {
        type: String,
        match: [/^[1-9][0-9]{9}$/]
    },
    password: {
        type: String
    },
    vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }]
}, {
    versionKey: false,
    timestamps: true
});

UserSchema.pre("save", function <UserModel>(next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

UserSchema.pre('update', function <UserModel>(next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (passw): Promise<boolean> {
    let password = this.password;
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(passw, password, function (err, success) {
            if (err) return reject(err);
            return resolve(success);
        });
    })
};

UserSchema.methods.toJSON = function<IUser> () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const userModel = MongooseModel<IUser>("User", UserSchema);

export const cleanCollection = () => userModel.remove({}).exec();

export default userModel;