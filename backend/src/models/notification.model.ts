// src/models/notification.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum NotificationType {
  Order = "order",
  Event = "event",
  Course = "course",
  Shop = "shop",
  Enrollment = "enrollment",
  General = "general"
}

export interface NotificationDocument extends Document {
  user_id: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relate_id?: Types.ObjectId;
  is_read: boolean;
  create_at: Date;
  data?: Record<string, any>;
  icon?: string;
  action_url?: string;
  priority?: 'low' | 'normal' | 'high';
  expiry_date?: Date;
}

const NotificationSchema = new Schema<NotificationDocument>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: Object.values(NotificationType), required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relate_id: { type: Schema.Types.ObjectId, refPath: 'type', index: true },
  is_read: { type: Boolean, default: false, index: true },
  create_at: { type: Date, default: Date.now, index: true },
  data: { type: Schema.Types.Mixed },
  icon: { type: String },
  action_url: { type: String },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  expiry_date: { type: Date }
});

// Create indexes for better query performance
NotificationSchema.index({ user_id: 1, create_at: -1 });
NotificationSchema.index({ user_id: 1, is_read: 1 });

export const Notification = model<NotificationDocument>('Notification', NotificationSchema);