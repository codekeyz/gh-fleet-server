import {IUser} from '../models/user.model';
import BaseSanitizer = require('./base.sanitizer');

class UserResource implements BaseSanitizer<IUser> {

    public collection(datalist: IUser[]): {}[] {
        return [];
    }

    public single(data: IUser, wrap = true): {} {
        let result = {
            id: data._id,
            username: data.username,
            email: data.email,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
        return wrap === true ? {data: result} : result;
    }

    handleCollection(datalist: IUser[]) {
    }
}

export = new UserResource();