import { Event, EventDocument } from '../models/event.model';
import {BaseService} from './base.service';

export class EventService extends BaseService<EventDocument> {
  constructor() {
    super(Event);
  }
}