import { Schema, model, Document, Types } from 'mongoose';
// import { validateOrderItems } from '../middlewares/order.middleware';


export enum OrderType {
  Product = 'product',
  Course = 'course',
  Ticket = 'ticket',
  AdsPackage = 'ads_package',
}

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Paid = 'paid',
  Failed = 'failed' 
}

interface OrderItem {
    ref_id: Types.ObjectId; // อ้างอิงไปที่ Products, Courses, หรือ Events
    ref_model: string; // เก็บชื่อ collection ที่ ref_id อ้างอิงไป
    variant_id?: Types.ObjectId; // อ้างอิงไปที่ Variants (ถ้ามี)
    seat_zone_id: Types.ObjectId;
    price_at_order: number;
    quantity: number;
  }

interface ShippingAddress {
  receiver_name: string;
  receiver_phone: string;
  province: string;
  district: string;
  subdistrict: string;
  street: string;
  postal_code: string;
  information?: string;
}

export interface OrderDocument extends Document {
  user_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  order_type: OrderType;
  items: OrderItem[];
  total_price: number;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  create_at: Date;
}

const OrderSchema = new Schema<OrderDocument>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
    order_type: { type: String, enum: Object.values(OrderType), required: true },
    items: [{
      ref_id: { type: Schema.Types.ObjectId, refPath: 'items.refModel', required: true }, // ใช้ refPath (product_id, course_id, event_id)
      ref_model: { type: String, required: true, enum: ['Product', 'Course', 'Event', 'AdsPackage'] }, // เก็บชื่อ collection
      variant_id: { type: Schema.Types.ObjectId, ref: 'Variant' }, // อ้างอิงไปที่ Variants (ถ้ามี)
      seat_zone_id: { type : Types.ObjectId },
      price_at_order: { type: Number, required: true },
      quantity: { type: Number, required: true },
      date:{type: Date},
    }],
    total_price: { type: Number, required: true },
    shipping_address: {
      receiver_name: { type: String, required: true },
      receiver_phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      subdistrict: { type: String, required: true },
      street: { type: String, required: true },
      postal_code: { type: String, required: true },
      information: { type: String },
    },
    status: { type: String, enum: Object.values(OrderStatus), required: true },
    create_at: { type: Date, required: true, default: Date.now },
  });

// OrderSchema.pre('validate', validateOrderItems);

export const Order = model<OrderDocument>('Order', OrderSchema);