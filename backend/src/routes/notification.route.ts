import express from 'express';
import {
    createNotificationController,
    getNotificationsController,
    getNotificationByIdController,
    updateNotificationController,
    deleteNotificationController
} from '../controllers/notification.controllers'

const route = express.Router();

route.get('/notifications', getNotificationsController);

route.get('/notification/:id', getNotificationByIdController);

route.post('/notifications', createNotificationController);

route.put('/notification/:id', updateNotificationController);

route.delete('/notifocation', deleteNotificationController);

export default route;