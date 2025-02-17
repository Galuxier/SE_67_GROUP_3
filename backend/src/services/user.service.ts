import { User, UserDocument } from '../models/user.model';
import {BaseService} from './base.service';

class UserService extends BaseService<UserDocument> {
  constructor() {
    super(User);
  }
}

export default new UserService();