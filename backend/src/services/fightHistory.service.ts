import { Types } from 'mongoose';
import { FightHistory, FightHistoryDocument} from '../models/fightHistory.model';
import { BaseService } from './base.service';

class FightHistoryService extends BaseService<FightHistoryDocument>{
    constructor(){
        super(FightHistory);
    }

    async getFightHistoriesByUserId(userId: string): Promise<FightHistoryDocument[]> {
        try {
          return await FightHistory.find({ user_id: new Types.ObjectId(userId) })
            .populate('event_id')
            .populate('weight_class_id')
            .populate('match_id');
        } catch (error) {
          console.error('Error fetching fight histories by user ID:', error);
          throw error;
        }
      }
}

export default new FightHistoryService;