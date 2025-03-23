import { Schema, model, Document, Types } from 'mongoose';

// Define interface for address
interface Address {
  province: string;
  district: string;
  subdistrict: string;
  street: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  information?: string; // optional field
}

// Define interface for contacts (key-value pairs)
interface Contacts {
  [key: string]: string; // key and value are strings
}

// Define interface for Shop document
export interface ShopDocument extends Document {
  owner_id: Types.ObjectId; // Reference to User
  shop_name: string;
  license?: string; // optional field
  description: string;
  logo: string;
  contacts: Contacts; // key-value pairs
  address: Address;
  create_at: Date;
}

// Create schema for Shop
const ShopSchema = new Schema<ShopDocument>({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  shop_name: { type: String, required: true },
  license: { type: String },
  description: { type: String },
  logo: { type: String },
  contacts: { type: Schema.Types.Mixed, required: true }, // Use Mixed type for key-value pairs
  address: {
    province: { type: String },
    district: { type: String },
    subdistrict: { type: String },
    street: { type: String },
    postal_code: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    information: { type: String },
  },
  create_at: { type: Date, default: Date.now, required: true },
});

// Create and export Shop model
export const Shop = model<ShopDocument>('Shop', ShopSchema);