import {injectable} from 'inversify';


@injectable()
export class DriverService {


    public getUsers() {
        return 'Hello Drivers'
    }
}

