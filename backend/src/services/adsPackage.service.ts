import { AdsPackageModel, AdsPackageDocument, AdsPackageType  } from '../models/adsPackage.model';
import { BaseService } from './base.service';

class AdsPackageService extends BaseService<AdsPackageDocument> {
  constructor() {
    super(AdsPackageModel);
  }

  async getPackagesByType(type: AdsPackageType): Promise<AdsPackageDocument[]> {
    return await AdsPackageModel.find({ type, status: 'active' });
  }
  
  // Get all active packages
  async getActivePackages(): Promise<AdsPackageDocument[]> {
    return await AdsPackageModel.find({ status: 'active' });
  }
}

export default new AdsPackageService();