/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useNotificationPolling.js
import { useState, useEffect, useRef } from "react";
import { getNotifications } from "../services/api/NotificationApi";
import { useAuth } from "../context/AuthContext";

export const useNotificationPolling = (interval = 5000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoggedIn } = useAuth();
  const pollingRef = useRef(null);

  const fetchNotifications = async () => {
    if (!isLoggedIn || !user?._id) return;
    
    try {
      setError(null);
      const response = await getNotifications(user._id);
      const notificationData = response.data || [];
      
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter(notif => !notif.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    // Implementation for marking notification as read
    // You would need to add this API function
    // await markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n._id === notificationId ? {...n, is_read: true} : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    // Implementation for marking all notifications as read
    // You would need to add this API function
    // await markAllNotificationsAsRead(user._id);
    setNotifications(prev => prev.map(n => ({...n, is_read: true})));
    setUnreadCount(0);
  };

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      // Initial fetch
      fetchNotifications();
      
      // Set up polling
      pollingRef.current = setInterval(fetchNotifications, interval);
      
      // Clean up
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [isLoggedIn, user?._id, interval]);

  return { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead,
    refetch: fetchNotifications
  };
};