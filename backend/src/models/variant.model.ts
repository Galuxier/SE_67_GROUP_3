import { Schema, model, Document, Types } from 'mongoose';

export enum VariantStatus {
  Active = 'active',
  Inactive = 'inactive',
  OutOfStock = 'out_of_stock'
}

export interface VariantDocument extends Document {
  product_id: Types.ObjectId;
  attributes: Record<string, any>;
  variant_image_url: string;
  price: number;
  stock: number;
  sku: string;
  status: VariantStatus;
  created_at: Date;
  updated_at: Date;
}

const VariantSchema = new Schema<VariantDocument>({
  product_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  attributes: { 
    type: Schema.Types.Mixed,
    required: true
  },
  variant_image_url: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true,
    default: 0
  },
  sku: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(VariantStatus),
    default: VariantStatus.Active
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Create a compound index for product_id and sku to ensure SKUs are unique per product
VariantSchema.index({ product_id: 1, sku: 1 }, { unique: true });

export const Variant = model<VariantDocument>('Variant', VariantSchema);