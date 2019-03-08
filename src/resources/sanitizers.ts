import {IUser} from '../models/user.model';

export function sanitizeUserData(data: IUser) {
    return {
        id: data._id,
        username: data.username,
        email: data.email,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        vehicles: data.vehicles
    }
}