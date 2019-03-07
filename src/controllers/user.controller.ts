import {controller, httpGet, interfaces} from 'inversify-express-utils';
import {inject} from 'inversify';
import {UserService} from '../services/user.service';
import {NextFunction, Request, Response} from 'express';
import TYPES from '../config/di/types';

@controller('/users')
export class UserController implements interfaces.Controller {

    constructor(@inject(TYPES.UserService) private userSvc: UserService) {

    }

    @httpGet('*')
    private index(req: Request, res: Response, next: NextFunction): string {
        return 'Hello world';
    }

}

