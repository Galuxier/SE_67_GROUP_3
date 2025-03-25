import { Place, PlaceDocument } from '../models/place.model';
import { BaseService } from './base.service';

class PlaceService extends BaseService<PlaceDocument> {
    constructor(){
        super(Place);
    }
}

export default new PlaceService;