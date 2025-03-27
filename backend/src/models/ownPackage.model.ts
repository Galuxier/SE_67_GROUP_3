// src/models/ownPackage.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum OwnPackageType {
  Course = 'course',
  Event = 'event'
}

export enum OwnPackageStatus {
  Active = 'active',
  Used = 'used',
  Expired = 'expired',
  Cancelled = 'cancelled'
}

export interface OwnPackageDocument extends Document {
  user_id: Schema.Types.ObjectId;
  package_id: Schema.Types.ObjectId;
  order_id: Schema.Types.ObjectId;
  type: OwnPackageType;
  status: OwnPackageStatus;
  expiry_date: Date;
  used_at?: Date;
  purchased_at: Date;
  ref_id?: Types.ObjectId;   // Reference to the course or event using this package
}

const OwnPackageSchema = new Schema<OwnPackageDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  package_id: { type: Schema.Types.ObjectId, ref: 'AdsPackage', required: true },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  type: { type: String, enum: Object.values(OwnPackageType), required: true },
  status: { 
    type: String, 
    enum: Object.values(OwnPackageStatus), 
    required: true, 
    default: OwnPackageStatus.Active 
  },
  expiry_date: { type: Date, required: true },
  used_at: { type: Date },
  purchased_at: { type: Date, required: true, default: Date.now },
  ref_id: { type: Schema.Types.ObjectId, refPath: 'type' } // Dynamic reference based on the type field
});

// Add indexes for improved query performance
OwnPackageSchema.index({ user_id: 1, status: 1 });
OwnPackageSchema.index({ user_id: 1, type: 1 });
OwnPackageSchema.index({ expiry_date: 1 }); // For finding expired packages

export const OwnPackage = model<OwnPackageDocument>('OwnPackage', OwnPackageSchema);