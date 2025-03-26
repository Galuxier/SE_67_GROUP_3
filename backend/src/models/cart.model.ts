import { Schema, model, Document, Types } from 'mongoose';

interface CartItem {
  product_id: Types.ObjectId; // อ้างอิงไปที่ Products
  variant_id: Types.ObjectId; // อ้างอิงไปที่ Variants (ถ้ามี)
  quantity: number;
}

interface CartShop {
  shop_id: Types.ObjectId; // อ้างอิงไปที่ Shops
  items: CartItem[];
}

export interface CartDocument extends Document {
  user_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  shops: CartShop[];
  total_price: number;
}

const CartSchema = new Schema<CartDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
  shops: [{
    shop_id: { type: Types.ObjectId, ref: 'Shop', required: true }, // อ้างอิงไปที่ Shops
    items: [{
      product_id: { type: Types.ObjectId, ref: 'Product', required: true }, // อ้างอิงไปที่ Products
      variant_id: { type: Types.ObjectId, ref: 'Variant'}, // อ้างอิงไปที่ Variants (ถ้ามี)
      quantity: { type: Number, required: true },
    }],
  }],
  total_price: { type: Number, required: true },
});



export const Cart = model<CartDocument>('Cart', CartSchema);