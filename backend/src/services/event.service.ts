import { Event, EventDocument } from '../models/event.model';
import {BaseService} from './base.service';
import { Types } from 'mongoose';

class EventService extends BaseService<EventDocument> {
  constructor() {
    super(Event);
  }

  async getEventByOrganizerId(id: string): Promise<EventDocument[]> {
      return await Event.find({ organizer_id: new Types.ObjectId(id) });
  }
}

export default new EventService;