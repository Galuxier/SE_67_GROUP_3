import { Schema, model, Document, Types } from 'mongoose';

export enum EnrollmentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type RoleType = 'gym_owner' | 'organizer' | 'shop_owner' | 'trainer' | 'boxer' | 'lessor';

export interface EnrollmentDocument extends Document {
  user_id: Types.ObjectId;
  role: RoleType;
  description: string;
  license_urls: string[];
  status: EnrollmentStatus;
  create_at: Date;
  updated_at?: Date;
  reviewer_id?: Types.ObjectId;
  reject_reason?: string;
}

const EnrollmentSchema = new Schema<EnrollmentDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['gym_owner', 'organizer', 'shop_owner', 'trainer', 'boxer', 'lessor'],
  },
  description: { type: String, required: true },
  license_urls: { type: [String], required: true },
  status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.Pending },
  create_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date },
  reviewer_id: { type: Schema.Types.ObjectId, ref: 'User' },
  reject_reason: { type: String },
});

export const Enrollment = model<EnrollmentDocument>('Enrollment', EnrollmentSchema);