import { User, UserDocument } from '../models/user.model';
import {BaseService} from './base.service';

class UserService extends BaseService<UserDocument> {
  constructor() {
    super(User);
  }

  async getUserProfile(username: string) {
    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        throw new Error('User not found');
      }

      
      return user;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error; 
    }
  }


}

export default new UserService();