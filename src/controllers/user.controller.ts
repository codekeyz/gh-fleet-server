import {controller, httpGet, httpPost, httpPut, interfaces, requestParam} from 'inversify-express-utils';
import {inject} from 'inversify';
import {UserService} from '../services/user.service';
import {NextFunction, Request, Response} from 'express';
import TYPES from '../config/di/types';
import {body, check, validationResult} from 'express-validator/check';
import {VehicleService} from '../services/vehicle.service';
import {FirebaseService} from '../services/firebase.service';
import '../typings/express.user.module';
import userResource = require('../resources/user.resource');
import vehicleResource = require('../resources/vehicle.resource');

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
            const result = await this._userSvc.createUser(req.body);
            await this._firebSvc.getAuth().createUser({
                uid: result.id,
                email: req.body.email,
                password: req.body.password,
                displayName: req.body.username
            });
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
        let vh = await this._vhSvc.createVehicle(user, req.body);
        user.vehicles.push(vh);
        await user.save();
        return res.json(await vehicleResource.single(vh));
    }

    @httpPut('/me/vehicles/:id',
        TYPES.UserLoggedInMiddleWare,
        body('name')
            .optional()
            .not().isEmpty()
            .trim(),
        body('color')
            .optional()
            .not().isEmpty()
            .trim(),
        body('vehicle_type_name')
            .optional()
            .not().isEmpty()
            .trim(),
        check('fuel_volume_units')
            .optional()
            .not().isEmpty()
            .isIn(['us_gallons', 'uk_gallons', 'litres'])
            .withMessage('fuel_volume_units must be one of this [us_gallons, uk_gallons, litres]'),
        check('archived')
            .optional()
            .not().isEmpty()
            .isBoolean()
            .withMessage('archived field requires a boolean')
    )
    public updateVehicle(@requestParam("id") _id: string, req: Request, res: Response, next: NextFunction) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let query = {};
        let update = {};
        query['_id'] = _id;
        query['owner'] = req.user.id;

        let name = req.body.name;
        let color = req.body.color;
        let volume = req.body.fuel_volume_units;
        let vtypename = req.body.vehicle_type_name;
        let archived: boolean = req.body.archived;

        if (name) {
            update['name'] = name;
        }
        if (color) {
            update['color'] = color;
        }
        if (volume) {
            update['fuel_volume_units'] = volume;
        }
        if (vtypename) {
            update['vehicle_type_name'] = vtypename;
        }
        if (archived) {
            update['archived'] = archived;
        }

        return this._vhSvc.updateVehicle(query, {
            $set: update
        }).then(result => {
            res.send(vehicleResource.single(result));
        }).catch(err => {
            res.send(err.message);
        });
    }

    @httpGet('/me/vehicles',
        TYPES.UserLoggedInMiddleWare
    )
    public async getMyVehicles(req: Request, res: Response) {
        let result = await this._userSvc.findById(req.user.id).populate('vehicles').exec();
        return res.json(await vehicleResource.collection(result.vehicles))
    }


}

