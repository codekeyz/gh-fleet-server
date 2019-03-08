import {inject, injectable} from 'inversify';
import {IUser, userModel as User} from '../models/user.model';
import TYPES from '../config/di/types';
import {FirebaseService} from './firebase.service';

@injectable()
export class UserService {

    // public genToken = (user: IUser): Object => {
    //     let expires = moment().utc().add({days: 7}).unix();
    //     let token = jwt.encode({
    //         exp: expires,
    //         user: user
    //     }, config.jwtSecret);
    //
    //     return {
    //         issuer: 'iam@user.dev',
    //         token: `Bearer ${token}`,
    //         expires: moment.unix(expires).format(),
    //         // @ts-ignore
    //         role: user.constructor.modelName,
    //         id: user._id
    //     };
    // };
    public findByUsername = function (username: String) {
        return User.findOne({username});
    };
    public findById = function (id: string) {
        return User.findById(id);
    };
    public findByEmail = function (email: string) {
        return User.findOne({email})
    };

    constructor(@inject(TYPES.FirebaseService) private _fireSvc: FirebaseService) {
    }

    public createUser(data: IUser) {
        return new Promise((async (resolve, reject) => {
            try {
                const acc = await this._fireSvc.getAuth().createUser({
                    email: data.email,
                    // @ts-ignore
                    password: data.password,
                    displayName: data.username
                });
                data._id = acc.uid;
                let account = await new User(data).save();
                const result = account.toObject();
                result.token = await this.genToken(data._id);
                return resolve(result);
            }
            catch (err) {
                return reject(err);
            }
        }))
    };

    public genToken(id: string) {
        return this._fireSvc.getAuth().createCustomToken(id);
    }

}

