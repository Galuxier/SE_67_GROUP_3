// src/services/api/NotificationApi.js
import { api } from "../Axios";

export const getNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notification/${notificationId}/read`, {
      is_read: true
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await api.put(`/notifications/mark-all-read`, {
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};