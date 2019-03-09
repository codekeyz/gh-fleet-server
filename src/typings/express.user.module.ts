import {IUser} from '../models/user.model';

declare module "express" { // declare module "express-serve-static-core"

    export interface Request {
        user: IUser
    }
}