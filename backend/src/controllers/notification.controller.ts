// src/controllers/notification.controller.ts
import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';
import { NotificationType } from '../models/notification.model';

// Get notifications for a user
export const getUserNotificationsController = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    
    if (!userId) {
      res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
      return;
    }

    // Extract optional query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const isRead = req.query.is_read !== undefined ? 
      req.query.is_read === 'true' : undefined;
    const type = req.query.type as NotificationType | undefined;
    const sortBy = req.query.sort_by as string || 'create_at';
    const sortDirection = req.query.sort_direction as 'asc' | 'desc' || 'desc';

    const result = await NotificationService.getUserNotifications(userId, {
      page,
      limit,
      isRead,
      type,
      sortBy,
      sortDirection
    });

    res.status(200).json({
      success: true,
      data: result.notifications,
      meta: {
        total: result.total,
        unread_count: result.unreadCount,
        page,
        limit,
        total_pages: Math.ceil(result.total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching user notifications:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications', 
      error: err 
    });
  }
};

// Create a new notification
export const createNotificationController = async (req: Request, res: Response) => {
  try {
    const { 
      user_id,
      type, 
      title, 
      message, 
      relate_id,
      data,
      icon,
      action_url,
      priority,
      expiry_date
    } = req.body;

    // Validate required fields
    if (!user_id || !type || !title || !message) {
      res.status(400).json({
        success: false,
        message: 'user_id, type, title, and message are required fields'
      });
      return;
    }

    const newNotification = await NotificationService.createNotification({
      user_id,
      type,
      title,
      message,
      relate_id,
      data,
      icon,
      action_url,
      priority,
      expiry_date: expiry_date ? new Date(expiry_date) : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(400).json({ 
      success: false, 
      message: 'Error creating notification', 
      error: err 
    });
  }
};

// Mark a notification as read
export const markNotificationAsReadController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const updatedNotification = await NotificationService.markAsRead(id);
    
    if (!updatedNotification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification
    });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking notification as read', 
      error: err 
    });
  }
};

// Mark all notifications for a user as read
export const markAllAsReadController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }
    
    const result = await NotificationService.markAllAsRead(user_id);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: result
    });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking all notifications as read', 
      error: err 
    });
  }
};

// Delete notifications
export const deleteNotificationsController = async (req: Request, res: Response) => {
  try {
    const { user_id, notification_ids } = req.body;
    
    if (!user_id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return ;
    }
    
    const result = await NotificationService.deleteUserNotifications(
      user_id, 
      notification_ids
    );
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      data: result
    });
  } catch (err) {
    console.error('Error deleting notifications:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting notifications', 
      error: err 
    });
  }
};

// Get unread notification count for a user
export const getUnreadCountController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return ;
    }
    
    const count = await NotificationService.getUnreadCount(user_id);
    
    res.status(200).json({
      success: true,
      data: { unread_count: count }
    });
  } catch (err) {
    console.error('Error getting unread notification count:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting unread notification count', 
      error: err 
    });
  }
};

// Cleanup expired notifications (can be called by cron job)
export const cleanupExpiredNotificationsController = async (req: Request, res: Response) => {
  try {
    const result = await NotificationService.deleteExpiredNotifications();
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} expired notifications deleted`,
      data: result
    });
  } catch (err) {
    console.error('Error cleaning up expired notifications:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error cleaning up expired notifications', 
      error: err 
    });
  }
};