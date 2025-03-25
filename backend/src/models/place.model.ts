import { Schema, model, Document } from 'mongoose';

// กำหนด interface สำหรับ Place document
export interface PlaceDocument extends Document {
  owner_id: Schema.Types.ObjectId;
  name: string;
  price: number;
  latitude: string;
  longitude: string;
  images: string[];
}

// สร้าง schema สำหรับ Place
const PlaceSchema = new Schema<PlaceDocument>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  images: { type: [String], required: true },
});

// สร้างโมเดล Place
export const Place = model<PlaceDocument>('Place', PlaceSchema);