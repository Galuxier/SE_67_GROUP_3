import { Location, LocationDocument } from '../models/location.model';
import { BaseService } from './base.service';

class LocationService extends BaseService<LocationDocument> {
    constructor(){
        super(Location);
    }
}

export default new LocationService;