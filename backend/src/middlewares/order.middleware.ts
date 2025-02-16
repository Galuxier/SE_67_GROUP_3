import { Document } from 'mongoose';
import { OrderDocument, OrderType } from '../models/order.model';

export const validateOrderItems = function (this: OrderDocument, next: Function) {
  const order = this; // ไม่ต้องใช้ as อีกครั้ง เพราะ this ถูกระบุประเภทแล้ว

  for (const item of order.items) {
    if (order.order_type === OrderType.Product && item.ref_model !== 'Product') {
      throw new Error('refModel must be "Product" for order_type "product"');
    }
    if (order.order_type === OrderType.Course && item.ref_model !== 'Course') {
      throw new Error('refModel must be "Course" for order_type "course"');
    }
    if (order.order_type === OrderType.Ticket && item.ref_model !== 'Event') {
      throw new Error('refModel must be "Event" for order_type "ticket"');
    }
  }

  next();
};