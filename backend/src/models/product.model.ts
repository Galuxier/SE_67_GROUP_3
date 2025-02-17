import { Schema, model, Document } from 'mongoose';

interface Variant {
  attribute?: Record<string, any>;
  image_url: string;
  price: number;
  stock: number;
}

export interface ProductDocument extends Document {
  shop_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Shops
  product_name: string;
  category: string;
  description: string;
  image_url: string[];
  variants: Variant[];
}

const ProductSchema = new Schema<ProductDocument>({
  shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', required: true }, // อ้างอิงไปที่ Shops
  product_name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: [String], required: true },
  variants: [{
    attribute: { type: Schema.Types.Mixed },
    image_url: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  }],
});



export const Product = model<ProductDocument>('Product', ProductSchema);