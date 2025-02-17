import { Gym, GymDocument } from '../models/gym.model';
import {BaseService} from './base.service';

class GymService extends BaseService<GymDocument> {
  constructor() {
    super(Gym);
  }
}

export default new GymService;