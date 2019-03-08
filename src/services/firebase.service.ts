import {injectable} from 'inversify';
import admin = require('firebase-admin');

@injectable()
export class FirebaseService {

    public getStorage()  {
        return admin.storage();
    }

    public getMessaging() {
        return admin.messaging();
    }

    public getAuth() {
        return admin.auth();
    }

}