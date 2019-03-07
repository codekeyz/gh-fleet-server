import {controller, httpGet, httpPost, interfaces} from 'inversify-express-utils';
import {inject} from 'inversify';
import {UserService} from '../services/user.service';
import {Request, Response} from 'express';
import TYPES from '../config/di/types';
import {check, validationResult} from 'express-validator/check';
import {sanitizeUserData} from '../resources/sanitizers';
import bcrypt = require('bcrypt');
const passport = require('../config/passport');

@controller('/users')
export class UserController implements interfaces.Controller {

    constructor(@inject(TYPES.UserService) private userSvc: UserService) {
    }

    @httpPost('/login',
        check('email')
            .isEmail()
            .withMessage('Email field is required'),
        check('password')
            .exists()
            .withMessage('Password field is required'))
    public async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let user = await this.userSvc.findByEmail(req.body.email).exec();
        if (!user) {
            return res.status(401)
                .json({message: 'Authentication failed', status: 401, success: false});
        }

        let success = await user.comparePassword(req.body.password);
        if (!success) {
            return res.status(401)
                .json({message: 'Authentication failed', status: 401, success: false});
        }

        return res.status(200).json(this.userSvc.genToken(user));
    }

    @httpPost('/register',
        check('username')
            .isLength({min: 5})
            .withMessage('Username field is required'),
        check('email')
            .isEmail()
            .withMessage('Email field is required'),
        check('password')
            .isLength({min: 5}).withMessage('must be at least 5 chars long')
            .matches(/\d/).withMessage('must contain a number')
    )
    public register(req: Request, res: Response) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        // Hash the User Password
        req.body.hashedPassword = bcrypt.hashSync(req.body.password, 10);
        return this.userSvc.createUser(req.body)
            .then(result => {
                return res.status(200).send(sanitizeUserData(result.toJSON()));
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }

    @httpGet('/me',
        passport.authenticate('jwt', {session: false})
    )
    public getMyAccount(req: Request, res: Response) {
        return res.json(sanitizeUserData(req.user));
    }


}

