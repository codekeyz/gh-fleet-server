import {injectable} from 'inversify';
import {IUser, userModel as User} from '../models/user.model';

@injectable()
export class UserService {

    public findByUsername = function (username: String) {
        return User.findOne({username});
    };

    public findById = function (id: string) {
        return User.findById(id);
    };

    public findByEmail = function (email: string) {
        return User.findOne({email})
    };

    public createUser(data: IUser) {
        return new Promise<IUser>((async (resolve, reject) => {
            try {
                let account = await new User(data).save();
                return resolve(account);
            }
            catch (err) {
                return reject(err);
            }
        }))
    };
}

