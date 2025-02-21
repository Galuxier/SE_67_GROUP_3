import { Order, OrderDocument } from '../models/order.model';
import {BaseService} from './base.service';

class OrderService extends BaseService<OrderDocument> {
  constructor() {
    super(Order);
  }
}

export default new OrderService;