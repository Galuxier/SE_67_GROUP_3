import { Order, OrderDocument } from '../models/order.model';
import {BaseService} from './base.service';

export class OrderService extends BaseService<OrderDocument> {
  constructor() {
    super(Order);
  }
}