import { FightHistory, FightHistoryDocument} from '../models/fightHistory.model';
import { BaseService } from './base.service';

class FightHistoryService extends BaseService<FightHistoryDocument>{
    constructor(){
        super(FightHistory);
    }
}

export default new FightHistoryService;