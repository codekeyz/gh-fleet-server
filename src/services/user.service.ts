import {injectable} from 'inversify';
import {IUser, userModel as User} from '../models/user.model';
import * as config from '../config/config';
import * as moment from 'moment';
import jwt = require('jwt-simple');

@injectable()
export class UserService {

    public genToken = (user: IUser): Object => {
        let expires = moment().utc().add({days: 7}).unix();
        let token = jwt.encode({
            exp: expires,
            id: user._id
        }, config.jwtSecret);

        return {
            token: "Bearer " + token,
            expires: moment.unix(expires).format(),
            user: user._id
        };
    };

    public findByUsername = function (username: String) {
        return User.findOne({username});
    };

    public findById = function (id: string) {
        return User.findById(id);
    };

    public findByEmail = function (email: string) {
        return User.findOne({email})
    };

    public createUser = function (data) {
        let user = new User(data);
        return user.save();
    };

}

