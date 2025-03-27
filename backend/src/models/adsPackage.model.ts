import { Schema, model, Document } from 'mongoose';

export enum AdsPackageType {
  Coure = 'course',
  Event = 'event'
}

enum Status {
  Active = 'active',
  InActive = 'inactive',
}

export interface AdsPackageDocument extends Document {
  type: AdsPackageType;
  name: string;
  detail: string;
  duration: number;
  price: number;
  status: Status; 
}

const AdsPackageSchema = new Schema<AdsPackageDocument>({
  type: { type: String, enum: Object.values(AdsPackageType), required: true },
  name: { type: String, required: true },
  detail: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
});



export const AdsPackageModel = model<AdsPackageDocument>('AdsPackage', AdsPackageSchema);