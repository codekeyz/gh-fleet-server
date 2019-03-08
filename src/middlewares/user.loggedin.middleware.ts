import {inject, injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';
import {NextFunction, Request, Response} from 'express';
import TYPES from '../config/di/types';
import {FirebaseService} from '../services/firebase.service';
import {UserService} from '../services/user.service';

@injectable()
export class UserLoggedinMiddleware extends BaseMiddleware {

    @inject(TYPES.FirebaseService) private readonly _fbSvc: FirebaseService;
    @inject(TYPES.UserService) private readonly _userSvc: UserService;

    handler(req: Request, res: Response, next: NextFunction): void {
        let actoken: any = req.headers['account-token'];
        console.log(actoken);
        if (!actoken) {
            res.set('Account-Token', 'YOUR_ACCOUNT_TOKEN').status(401).send('HTTP Token: Access denied.\n')
            return;
        }
        this._fbSvc.getAuth().verifyIdToken(actoken, true)
            .then(res => {
                return this._userSvc.findById(res.uid)
            })
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => {
                res.status(401).send(`1HTTP Token: Access denied.\n${err}`)
            })
    }

}