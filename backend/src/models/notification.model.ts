import { Schema, model, Document } from 'mongoose';

enum NotificationType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

interface NotificationDocument extends Document {
  user_id: Schema.Types.ObjectId; // อ้างอิงไปที่ Users
  type: NotificationType;
  title: string;
  message: string;
  relate_id?: Schema.Types.ObjectId; // อ้างอิงไปที่ collection ต่างๆ
  is_read: boolean;
  create_at: Date;
}

const NotificationSchema = new Schema<NotificationDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่ Users
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relate_id: { type: Schema.Types.ObjectId, refPath: 'notifications.relateModel' }, // อ้างอิงไปที่ collection ต่างๆ
  is_read: { type: Boolean, required: true },
  create_at: { type: Date, default: Date.now, required: true },
});

const NotificationModel = model<NotificationDocument>('Notification', NotificationSchema);

export default NotificationModel;