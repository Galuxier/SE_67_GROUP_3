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

// Apply the middleware to each route individually for better control
router.get('/notifications', verifyToken, getUserNotificationsController);
router.get('/notifications/unread-count/:user_id', verifyToken, getUnreadCountController);
router.post('/notifications', verifyToken, createNotificationController);
router.put('/notification/:id/read', verifyToken, markNotificationAsReadController);
router.put('/notifications/mark-all-read', verifyToken, markAllAsReadController);
router.delete('/notifications', verifyToken, deleteNotificationsController);

// Export the router
export default router;