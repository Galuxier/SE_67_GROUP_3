import { AdsPackageModel, AdsPackageDocument } from '../models/adsPackage.model';
import { BaseService } from './base.service';

class AdsPackageService extends BaseService<AdsPackageDocument> {
  constructor() {
    super(AdsPackageModel);
  }
}

export default new AdsPackageService();