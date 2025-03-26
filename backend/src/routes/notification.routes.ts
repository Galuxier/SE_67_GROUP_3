// src/routes/notification.routes.ts
import express from 'express';
import {
  getUserNotificationsController,
  createNotificationController,
  markNotificationAsReadController,
  markAllAsReadController,
  deleteNotificationsController,
  getUnreadCountController,
  cleanupExpiredNotificationsController
} from '../controllers/notification.controller';
import verifyToken from '../middlewares/auth';

const router = express.Router();

// Routes that require authentication
router.use(verifyToken);

// Get notifications for a user with optional filters
router.get('/notifications', getUserNotificationsController);

// Get unread notification count for a user
router.get('/notifications/unread-count/:user_id', getUnreadCountController);

// Create a new notification
router.post('/notifications', createNotificationController);

// Mark a notification as read
router.put('/notification/:id/read', markNotificationAsReadController);

// Mark all notifications for a user as read
router.put('/notifications/mark-all-read', markAllAsReadController);

// Delete notifications
router.delete('/notifications', deleteNotificationsController);

export default router;