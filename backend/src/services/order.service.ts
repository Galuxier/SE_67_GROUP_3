import { Order, OrderDocument } from '../models/order.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

class OrderService extends BaseService<OrderDocument> {
  constructor() {
    super(Order);
  }

  // New method to get orders by shop ID
  async getOrdersByShopId(shopId: string): Promise<OrderDocument[]> {
    // Find orders where at least one item in the shops array has the matching shop_id
    return await Order.find({ 
      "shops.shop_id": new Types.ObjectId(shopId) 
    }).populate('user_id', 'username first_name last_name');
  }
}

export default new OrderService;