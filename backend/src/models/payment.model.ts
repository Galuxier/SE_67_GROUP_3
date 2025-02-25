import { Schema, model, Document } from 'mongoose';

enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

export interface PaymentDocument extends Document {
  order_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Orders
  user_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  paid_at?: Date;
}

const PaymentSchema = new Schema<PaymentDocument>({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true }, // อ้างอิงไปที่ Orders
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  payment_status: { type: String, enum: Object.values(PaymentStatus), required: true },
  paid_at: { type: Date },
});

export const Payment = model<PaymentDocument>('Payment', PaymentSchema);