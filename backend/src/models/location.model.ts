import { Schema, model, Document } from 'mongoose';

// กำหนด interface สำหรับ Location document
export interface LocationDocument extends Document {
  owner_id: Schema.Types.ObjectId;
  name: string;
  price: number;
  latitude: string;
  longitude: string;
  images: string[];
}

// สร้าง schema สำหรับ Location
const LocationSchema = new Schema<LocationDocument>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  images: { type: [String], required: true },
});

// สร้างโมเดล Location
export const Location = model<LocationDocument>('Location', LocationSchema);