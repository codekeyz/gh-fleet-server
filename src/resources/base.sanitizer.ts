import {IVehicle} from '../models/vehicle.model';

/**
 * All Resources must implement this\ interface
 * @type D - Object
 * @Type C - Return Type for Object Collection
 */
interface BaseSanitizer<D> {

    /**
     * Interface for Sanitizing List Of D Objects
     * @param datalist
     * @type D
     */
    collection(datalist: D[]);

    /**
     * Interface for Sanitizing Single Object Responses
     * @param data
     * @param wrap
     */
    single(data: D, wrap?: boolean): {};
}

export = BaseSanitizer;