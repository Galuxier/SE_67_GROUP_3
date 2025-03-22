import { Types } from 'mongoose';
import { Shop, ShopDocument } from '../models/shop.model';
import { BaseService } from './base.service';

class ShopService extends BaseService<ShopDocument> {
  constructor() {
    super(Shop); // Pass Model to BaseService
  }

  // Get shops by owner ID
  async getUserShops(user_id: Types.ObjectId): Promise<ShopDocument[]> {
    try {
      // Use 'owner_id' field to query shops belonging to the user
      const shops = await Shop.find({ owner_id: user_id }).exec();
      return shops;
    } catch (error) {
      console.error('Error fetching user shops:', error);
      throw error;
    }
  }
}
 
export default new ShopService();