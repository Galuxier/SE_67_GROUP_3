import { Place, PlaceDocument } from '../models/place.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

class PlaceService extends BaseService<PlaceDocument> {
    constructor(){
        super(Place);
    }

    async getPlacesByOwnerId(ownerId: string): Promise<PlaceDocument[]> {
        return await Place.find({ owner_id: new Types.ObjectId(ownerId) });
    }

    async getById(id: string): Promise<PlaceDocument | null> {
        return await Place.findById(id);
    }
}

export default new PlaceService;