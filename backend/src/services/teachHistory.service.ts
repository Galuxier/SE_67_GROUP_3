import { TeachHistory, TeachHistoryDocument } from '../models/teachHistory.model';
import {BaseService} from './base.service';

class TeachHistoryService extends BaseService<TeachHistoryDocument> {
  constructor() {
    super(TeachHistory);
  }
}

export default new TeachHistoryService;