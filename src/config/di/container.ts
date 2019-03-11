// load everything needed to the Container
import {Container} from 'inversify';
import {UserService} from '../../services/user.service';
import TYPES from './types';
import {DriverService} from '../../services/driver.service';
import {VehicleService} from '../../services/vehicle.service';
import {FirebaseService} from '../../services/firebase.service';
import {UserLoggedinMiddleware} from '../../middlewares/user.loggedin.middleware';

let container = new Container();
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<DriverService>(TYPES.DriverService).to(DriverService);
container.bind<VehicleService>(TYPES.VehicleService).to(VehicleService);
container.bind<FirebaseService>(TYPES.FirebaseService).to(FirebaseService);
container.bind<UserLoggedinMiddleware>(TYPES.UserLoggedInMiddleWare).to(UserLoggedinMiddleware);

export = container;