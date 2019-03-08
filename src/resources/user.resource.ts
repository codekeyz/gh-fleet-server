import {IUser} from '../models/user.model';
import BaseSanitizer = require('./base.sanitizer');

class UserResource implements BaseSanitizer<IUser> {

    collection(datalist: IUser[]): {}[] {
        return [];
    }

    single(data: IUser, wrap?: boolean): {} {
        let result = {
            id: data._id,
            username: data.username,
            email: data.email,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
        return wrap === true ? {data: result} : result;
    }


}

export = new UserResource();