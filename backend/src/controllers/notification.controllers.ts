import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';

// สร้างการแจ้งเตือนใหม่
export const createNotificationController = async (req: Request, res: Response) => {
  try {
    const newNotification = await NotificationService.add(req.body);
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: 'Error creating notification', error: err });
  }
};

// ดึงข้อมูลการแจ้งเตือนทั้งหมด
export const getNotificationsController = async (req: Request, res: Response) => {
  try {
    const notifications = await NotificationService.getAll();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err });
  }
};

// ดึงข้อมูลการแจ้งเตือนจาก _id
export const getNotificationByIdController = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.getById(req.params.id);
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notification', error: err });
  }
};

// อัปเดตข้อมูลการแจ้งเตือน
export const updateNotificationController = async (req: Request, res: Response) => {
  try {
    const updatedNotification = await NotificationService.update(req.params.id, req.body);
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err });
  }
};

// ลบการแจ้งเตือน
export const deleteNotificationController = async (req: Request, res: Response) => {
  try {
    const deletedNotification = await NotificationService.delete(req.params.id);
    res.status(200).json(deletedNotification);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err });
  }
};