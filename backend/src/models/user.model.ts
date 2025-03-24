import { Schema, model, Document } from 'mongoose';

export interface License {
  license_type: string;
  license: string;
}

export interface UserDocument extends Document {
  username: string;
  password: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
  first_name: string;
  last_name: string;
  nickname: string;
  bio: string;
  licenses?: License[];
  gym_id?: Schema.Types.ObjectId;
  contact_info?: { [key: string]: any }; // รับ key-value ที่ไม่กำหนดโครงสร้าง
  role: string[];
  create_at: Date;
  updated_at?: Date;
  status: 'active' | 'inActive';
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String },
  password: { type: String },
  email: { type: String, },
  phone: { type: String },
  profile_picture_url: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  nickname: { type: String },
  bio: { type: String },
  licenses: [{
    license_type: { type: String, required: true },
    license: { type: String, required: true },
  }],
  gym_id: { type: Schema.Types.ObjectId },
  contact_info: { type: Schema.Types.Mixed }, // รับ key-value ที่ไม่กำหนดโครงสร้าง
  role: [{ type: String, enum: ['member', 'organizer', 'boxer', 'trainer', 'gym_owner', 'shop_owner', 'lessor', 'admin'], required: true }],
  create_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date },
  status: { type: String, enum: ['active', 'inActive'], required: true, default: 'active' },
});

export const User = model<UserDocument>('User', UserSchema);