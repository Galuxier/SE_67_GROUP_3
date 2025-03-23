import { Schema, model, Document, Types } from 'mongoose';

const categories = [
  'training_gloves',
  'bag_gloves',
  'competition_gloves',
  'hand_wraps',
  'shorts',
  'shin_guards',
  'ankle_supports',
  'mouth_guard',
  'groin_protector',
  'elbow_pads',
  'headgear',
  'heavy_bag',
  'kick_pads',
  'speed_bag',
  'jump_rope',
  'pra_jiad_mongkol',
  'focus_mitts',
  'belly_pad',
  'freestanding_bag',
  'knee_guards',
  'abdominal_protector',
  'medicine_ball',
  'bell',
  'stopwatch',
  'dumbbell',
  'barbell',
] as const;

type Category = (typeof categories)[number];

export interface ProductDocument extends Document {
  shop_id: Types.ObjectId;
  product_name: string;
  category: Category;
  description: string;
  product_image_urls: string[];
  base_price: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<ProductDocument>({
  shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  product_name: { type: String, required: true },
  category: { type: String, enum: categories, required: true },
  description: { type: String, required: true },
  product_image_urls: { type: [String], required: true },
  base_price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const Product = model<ProductDocument>('Product', ProductSchema);
