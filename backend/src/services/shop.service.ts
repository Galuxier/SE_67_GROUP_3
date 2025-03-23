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

  async checkShopNameExists(shopName: string): Promise<boolean> {
    try {
      // ใช้ RegExp เพื่อทำ case-insensitive search
      const regex = new RegExp(`^${shopName}$`, 'i');
      const shop = await Shop.findOne({ shop_name: regex });
      return !!shop; // return true ถ้าพบร้านค้า, false ถ้าไม่พบ
    } catch (error) {
      console.error('Error checking shop name existence:', error);
      throw error;
    }
  }
  async getShopByName(shopName: string): Promise<ShopDocument | null> {
    try {
      // ค้นหาร้านค้าด้วย shop_name ใช้ case-insensitive ด้วย RegExp
      const regex = new RegExp(`^${shopName}$`, 'i');
      return await Shop.findOne({ shop_name: regex });
    } catch (error) {
      console.error('Error fetching shop by name:', error);
      throw error;
    }
  }
}
 
export default new ShopService();