import { Schema, model, Document } from 'mongoose';

enum NotificationType {
  Course = "course",
  Event = "event",
  Shop = "shop",
  Enrollment = "enrollment",
  General = "general" // ✅ เพิ่ม General สำหรับการแจ้งเตือนทั่วไป
}

export interface NotificationDocument extends Document {
  user_id: Schema.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relate_id?: Schema.Types.ObjectId;
  order_id?: Schema.Types.ObjectId;
  is_read: boolean;
  create_at: Date;
  data?: Record<string, any>; // ✅ ข้อมูลเพิ่มเติมในรูป JSON
  icon?: string; // ✅ Icon ที่จะแสดงใน UI
  action_url?: string; // ✅ URL สำหรับ redirect
}

const NotificationSchema = new Schema<NotificationDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relate_id: { type: Schema.Types.ObjectId, refPath: 'type' }, // ✅ รองรับหลาย collection ผ่าน refPath
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  is_read: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now },
  data: { type: Schema.Types.Mixed }, // ✅ รองรับ JSON object
  icon: { type: String }, // ✅ รองรับไอคอน เช่น "bell", "event", "shop"
  action_url: { type: String } // ✅ รองรับ redirect URL
});

export const Notification = model<NotificationDocument>('Notification', NotificationSchema);