import { Event, EventDocument } from '../models/event.model';
import {BaseService} from './base.service';

class EventService extends BaseService<EventDocument> {
  constructor() {
    super(Event);
  }
}

export default new EventService;