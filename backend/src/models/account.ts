import mongoose, { Document, Schema } from 'mongoose';

// สร้าง Interface สำหรับข้อมูล User
interface IAccount extends Document {
  user_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  create_at: Date;
}

// สร้าง Schema สำหรับ User
const accountSchema: Schema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

// สร้าง Model สำหรับ User
const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
