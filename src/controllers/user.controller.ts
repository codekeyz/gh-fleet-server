import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
    queryParam,
    requestParam
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {UserService} from '../services/user.service';
import {Request, Response} from 'express';
import TYPES from '../config/di/types';
import {body, check, param, validationResult} from 'express-validator/check';
import {VehicleService} from '../services/vehicle.service';
import {FirebaseService} from '../services/firebase.service';
import '../typings/express.user.module';
import {accepted_extensions} from '../middlewares/image.middleware';
import userResource = require('../resources/user.resource');
import vehicleResource = require('../resources/vehicle.resource');
import multer = require('multer');

const vh_upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,// no larger than 5mb, you can change as needed.,
        files: 3                  // 3 files
    },
    fileFilter: (req, file, cb) => {
        // if the file extension is in our accepted list
        if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }

        // otherwise, return error
        return cb(new Error('Only ' + accepted_extensions.join(", ") + ' files are allowed!'), false);
    }
});


@controller('/users')
export class UserController implements interfaces.Controller {

    constructor(@inject(TYPES.UserService) private _userSvc: UserService,
                @inject(TYPES.VehicleService) private _vhSvc: VehicleService,
                @inject(TYPES.FirebaseService) private _firebSvc: FirebaseService) {
    }

    @httpGet('/logout',
        TYPES.UserMiddleWare)
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
        TYPES.UserMiddleWare
    )
    public getMyAccount(req: Request, res: Response) {
        return res.json(userResource.single(req.user));
    }

    @httpPost('/me/vehicles',
        TYPES.UserMiddleWare,
        check('name')
            .exists()
            .withMessage('Name field is required'),
        check('fuel_volume_units')
            .isIn(['us_gallons', 'uk_gallons', 'litres'])
            .withMessage('fuel_volume_units must be one of this [us_gallons, uk_gallons, litres]'),
        check('archived')
            .optional()
            .not().isEmpty()
            .isBoolean()
            .withMessage('archived field requires a boolean'),
        body('vehicle_type_name')
            .optional()
            .not().isEmpty()
            .trim(),
        body('name')
            .optional()
            .not().isEmpty()
            .trim(),
        body('color')
            .optional()
            .not().isEmpty()
            .trim(),
    )
    public async postVehicle(req: Request, res: Response) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        try {
            const user = req.user;
            let vh = await this._vhSvc.createVehicle(user, req.body);
            user.vehicles.push(vh);
            await user.save();
            return res.json(await vehicleResource.single(vh));
        } catch (e) {
            res.status(400).json(e);
        }
    }

    @httpPut('/me/vehicles/:id',
        TYPES.UserMiddleWare,
        param('id')
            .exists()
            .isMongoId()
            .withMessage('Given value is not a valid ID'),
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
    public updateVehicle(@requestParam('id') _id: string, req: Request, res: Response) {

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

    @httpDelete('/me/vehicles/:id',
        TYPES.UserMiddleWare,
        param('id')
            .exists()
            .isMongoId()
            .withMessage('Given value is not a valid ID'))
    public deleteVehicle(@requestParam('id') _id: string, req: Request, res: Response) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        let query = {};
        query['_id'] = _id;
        query['owner'] = req.user.id;

        return this._vhSvc.deleteVehicle(query).then(result => {
            res.send(vehicleResource.single(result));
        }).catch(err => {
            res.send(err.message);
        });
    }

    @httpPost('/me/vehicles/:id/images/upload',
        TYPES.UserMiddleWare,
        param('id')
            .exists()
            .isMongoId()
            .withMessage('Given value is not a valid ID'),
        vh_upload.array('images', 3)
    )
    public async uploadVehicleImages(@requestParam('id') _id: string, req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let query = {};
        query['_id'] = _id;
        query['owner'] = req.user.id;

        const doc = await this._vhSvc.findOneByQuery(query);

        if (!doc) {
            return res.status(404).json({
                message: 'Requested resource does not exists',
                data: null,
                success: false
            });
        }

        const files: any = req.files;
        const allTasks = await files.map(file => {
            const fileExt = file.originalname.split('.')[1];
            const newFilename = `${doc.id}-${new Date().getTime()}.${fileExt}`;
            const task = this._firebSvc.getStorage().bucket().file(`Vehicles/${doc.id}/${newFilename}`);
            return task.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype
                },
                public: true,
                gzip: true,
            })
                .then(() => {
                    return task.get();
                })
                .then(res => {
                    const link = res[0].metadata.mediaLink;
                    const name = res[0].metadata.name;
                    return this._vhSvc.setImageforVehicle(doc, {name, link});
                });
        });
        return Promise.all(allTasks)
            .then((result: any[]) => {
                res.status(200).json({
                    message: 'Action completed successfully.',
                    data: result[result.length - 1].images,
                    success: true
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: 'An error occurred. Verify Data & Try again.',
                    data: null,
                    success: false
                });
            });
    }

    @httpGet('/me/vehicles',
        TYPES.UserMiddleWare
    )
    public async getMyVehicles(@queryParam('color') color: string,
                               @queryParam('fuel_volume_units') fuel_volume_units: string,
                               @queryParam('vehicle_type_name') vehicle_type_name: string,
                               @queryParam('archived') archived: boolean,
                               @queryParam('offset') offset = `${0}`,
                               @queryParam('limit') lim = `${50}`,
                               req: Request,
                               res: Response) {
        const limit = parseInt(lim) > 50 ? 50 : parseInt(lim);
        const user = req.user.id;
        try {
            const result = await this._vhSvc.find(null, user, color, fuel_volume_units, vehicle_type_name, archived)
                .skip(parseInt(offset))
                .limit(limit)
                .exec();
            const formattedresult = await vehicleResource.collection(result, false);
            res.send(formattedresult);
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }
}

