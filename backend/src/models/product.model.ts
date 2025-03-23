import { Schema, model, Document, Types } from 'mongoose';

export interface ProductDocument extends Document {
  shop_id: Types.ObjectId;
  product_name: string;
  category: string;
  description: string;
  product_image_urls: string[];
  base_price: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<ProductDocument>({
  shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  product_name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  product_image_urls: { type: [String], required: true },
  base_price: {type: Number,required: true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Product = model<ProductDocument>('Product', ProductSchema);