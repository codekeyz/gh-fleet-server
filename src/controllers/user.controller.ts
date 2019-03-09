import {controller, httpGet, httpPost, httpPut, interfaces, requestParam} from 'inversify-express-utils';
import {inject} from 'inversify';
import {UserService} from '../services/user.service';
import {Request, Response} from 'express';
import TYPES from '../config/di/types';
import {check, validationResult} from 'express-validator/check';
import {VehicleService} from '../services/vehicle.service';
import {FirebaseService} from '../services/firebase.service';
import userResource = require('../resources/user.resource');
import vehicleResource = require('../resources/vehicle.resource');
import '../typings/express.user.module';


@controller('/users')
export class UserController implements interfaces.Controller {

    constructor(@inject(TYPES.UserService) private _userSvc: UserService,
                @inject(TYPES.VehicleService) private _vhSvc: VehicleService,
                @inject(TYPES.FirebaseService) private _firebSvc: FirebaseService) {
    }

    @httpGet('/logout',
        TYPES.UserLoggedInMiddleWare)
    public async logout(req: Request, res: Response) {
        await this._firebSvc.getAuth().revokeRefreshTokens(req.user.id);
        return res.send('Successfully logged out');
    }

    @httpPost('/register',
        check('username')
            .isLength({min: 5})
            .withMessage('Username field is required'),
        check('email')
            .isEmail()
            .withMessage('Email field requires a valid email'),
        check('password')
            .isLength({min: 5}).withMessage('must be at least 5 chars long')
            .matches(/\d/).withMessage('must contain a number')
    )
    public async register(req: Request, res: Response) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        try {
            const acc = await this._firebSvc.getAuth().createUser({
                email: req.body.email,
                // @ts-ignore
                password: req.body.password,
                displayName: req.body.username
            });
            req.body._id = acc.uid;
            const result = await this._userSvc.createUser(req.body);
            return res.status(200).json(userResource.single(result));
        }
        catch (err) {
            return res.status(400).json(err);
        }
    }

    @httpGet('/me',
        TYPES.UserLoggedInMiddleWare
    )
    public getMyAccount(req: Request, res: Response) {
        return res.json(userResource.single(req.user));
    }

    @httpPost('/me/vehicles',
        TYPES.UserLoggedInMiddleWare
    )
    public async postVehicle(req: Request, res: Response) {
        const user = req.user;
        let vh = await this._vhSvc.createVehicle(req.body);
        user.vehicles.push(vh);
        const result = await user.save();
        return res.json(await vehicleResource.collection(result.vehicles));
    }

    @httpPut('/me/vehicles/:id',
        TYPES.UserLoggedInMiddleWare)
    public async updateVehicle(@requestParam("id") id: string, res: Response) {
            return res.send(id);
    }

    @httpGet('/me/vehicles',
        TYPES.UserLoggedInMiddleWare
    )
    public async getMyVehicles(req: Request, res: Response) {
        let result = await this._userSvc.findById(req.user.id).populate('vehicles').exec();
        return res.json(await vehicleResource.collection(result.vehicles))
    }


}

