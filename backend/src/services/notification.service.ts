// src/services/notification.service.ts
import { Notification, NotificationDocument, NotificationType } from '../models/notification.model';
import { BaseService } from './base.service';
import { Types } from 'mongoose';

interface CreateNotificationParams {
  user_id: string | Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relate_id?: string | Types.ObjectId;
  data?: Record<string, any>;
  icon?: string;
  action_url?: string;
  priority?: 'low' | 'normal' | 'high';
  expiry_date?: Date;
}

class NotificationService extends BaseService<NotificationDocument> {
  constructor() {
    super(Notification);
  }

  // Create a notification with more flexible parameters
  async createNotification(params: CreateNotificationParams): Promise<NotificationDocument> {
    const notification = new Notification({
      ...params,
      user_id: typeof params.user_id === 'string' ? new Types.ObjectId(params.user_id) : params.user_id,
      relate_id: params.relate_id ? 
        (typeof params.relate_id === 'string' ? new Types.ObjectId(params.relate_id) : params.relate_id) : 
        undefined,
      is_read: false,
      create_at: new Date()
    });

    return await notification.save();
  }

  // Get notifications for a specific user with pagination
  async getUserNotifications(userId: string, options: { 
    page?: number, 
    limit?: number,
    isRead?: boolean,
    type?: NotificationType,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  } = {}): Promise<{ notifications: NotificationDocument[], total: number, unreadCount: number }> {
    const { 
      page = 1, 
      limit = 20,
      isRead,
      type,
      sortBy = 'create_at',
      sortDirection = 'desc'
    } = options;

    const query: any = { user_id: new Types.ObjectId(userId) };
    
    // Add optional filters if provided
    if (isRead !== undefined) {
      query.is_read = isRead;
    }
    
    if (type) {
      query.type = type;
    }
    
    // Add expiry date filter
    query.$or = [
      { expiry_date: { $exists: false } },
      { expiry_date: { $gt: new Date() } }
    ];

    // Create sort object
    const sort: any = {};
    sort[sortBy] = sortDirection === 'desc' ? -1 : 1;
    
    // If sorting by anything other than create_at, add create_at as secondary sort
    if (sortBy !== 'create_at') {
      sort.create_at = -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ user_id: new Types.ObjectId(userId), is_read: false })
    ]);

    return { notifications, total, unreadCount };
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { is_read: true },
      { new: true }
    );
  }

  // Mark all user notifications as read
  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany(
      { user_id: new Types.ObjectId(userId), is_read: false },
      { is_read: true }
    );

    return { modifiedCount: result.modifiedCount || 0 };
  }

  // Delete notifications that have expired
  async deleteExpiredNotifications(): Promise<{ deletedCount: number }> {
    const result = await Notification.deleteMany({
      expiry_date: { $lt: new Date() }
    });

    return { deletedCount: result.deletedCount || 0 };
  }

  // Get unread notification count for a user
  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({ 
      user_id: new Types.ObjectId(userId), 
      is_read: false 
    });
  }

  // Delete notifications for a user
  async deleteUserNotifications(userId: string, notificationIds?: string[]): Promise<{ deletedCount: number }> {
    const query: any = { user_id: new Types.ObjectId(userId) };
    
    if (notificationIds && notificationIds.length > 0) {
      query._id = { $in: notificationIds.map(id => new Types.ObjectId(id)) };
    }
    
    const result = await Notification.deleteMany(query);
    
    return { deletedCount: result.deletedCount || 0 };
  }
}

export default new NotificationService();