import { Types } from 'mongoose';
import { Shop, ShopDocument } from '../models/shop.model';
import { BaseService } from './base.service';

class ShopService extends BaseService<ShopDocument> {
  constructor() {
    super(Shop); // Pass Model to BaseService
  }

}
 
export default new ShopService();