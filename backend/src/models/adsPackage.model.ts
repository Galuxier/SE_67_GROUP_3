import { Schema, model, Document } from 'mongoose';

enum AdsPackageType {
  Banner = 'banner',
  Popup = 'popup',
  Video = 'video',
}

export interface AdsPackageDocument extends Document {
  type: AdsPackageType;
  name: string;
  duration: number;
  price: number;
}

const AdsPackageSchema = new Schema<AdsPackageDocument>({
  type: { type: String, enum: Object.values(AdsPackageType), required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
});



export const AdsPackageModel = model<AdsPackageDocument>('AdsPackage', AdsPackageSchema);