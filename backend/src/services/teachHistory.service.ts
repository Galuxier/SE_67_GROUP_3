import { Types } from 'mongoose';
import { TeachHistory, TeachHistoryDocument } from '../models/teachHistory.model';
import {BaseService} from './base.service';

class TeachHistoryService extends BaseService<TeachHistoryDocument> {
  constructor() {
    super(TeachHistory);
  }

  async getTeachHistoriesByUserId(userId: string): Promise<TeachHistoryDocument[]> {
    try {
      return await TeachHistory.find({ trainer_id: new Types.ObjectId(userId) })
        .populate('course_id');
    } catch (error) {
      console.error('Error fetching teach histories by user ID:', error);
      throw error;
    }
  }
}

export default new TeachHistoryService;