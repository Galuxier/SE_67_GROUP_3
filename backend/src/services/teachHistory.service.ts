import { TeachHistory, TeachHistoryDocument } from '../models/teachHistory.model';
import {BaseService} from './base.service';

export class TeachHistoryService extends BaseService<TeachHistoryDocument> {
  constructor() {
    super(TeachHistory);
  }
}