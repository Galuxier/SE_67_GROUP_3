import { Schema, model, Document } from 'mongoose';

// กำหนด interface สำหรับ address
interface Address {
  province: string;
  district: string;
  subdistrict: string;
  street: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  information?: string; // optional field
}

// กำหนด interface สำหรับ contacts (key-value pairs)
interface Contacts {
  [key: string]: string; // key และ value เป็น string
}

// กำหนด interface สำหรับ Shop document
interface ShopDocument extends Document {
  owner_id: Schema.Types.ObjectId; // อ้างอิงไปยัง User
  shop_name: string;
  license?: string; // optional field
  description: string;
  logo_url: string;
  contacts: Contacts; // key-value pairs
  address: Address;
  create_at: Date;
}

// สร้าง schema สำหรับ Shop
const ShopSchema = new Schema<ShopDocument>({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปยังโมเดล User
  shop_name: { type: String, required: true },
  license: { type: String },
  description: { type: String, required: true },
  logo_url: { type: String, required: true },
  contacts: { type: Schema.Types.Mixed, required: true }, // ใช้ Mixed type สำหรับ key-value pairs
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    subdistrict: { type: String, required: true },
    street: { type: String, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    information: { type: String },
  },
  create_at: { type: Date, default: Date.now, required: true },
});

// สร้างโมเดล Shop
const ShopModel = model<ShopDocument>('Shop', ShopSchema);

export default ShopModel;