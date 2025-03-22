import { Types } from 'mongoose';
import { Shop, ShopDocument } from '../models/shop.model';
import { BaseService } from './base.service';

class ShopService extends BaseService<ShopDocument> {
  constructor() {
    super(Shop); // Pass Model to BaseService
  }
  
  // Get all shops by owner ID
  async getShopsByOwnerId(ownerId: string): Promise<ShopDocument[]> {
    try {
      return await Shop.find({ owner_id: ownerId });
    } catch (error) {
      console.error('Error fetching shops by owner ID:', error);
      throw error;
    }
  }
}
 
export default new ShopService();