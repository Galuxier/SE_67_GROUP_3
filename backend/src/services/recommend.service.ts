import { Recommend, RecommendDocument} from '../models/recommend.model';
import { BaseService } from './base.service';

class RecommendService extends BaseService<RecommendDocument>{
    constructor(){
        super(Recommend);
    }
}

export default new RecommendService;