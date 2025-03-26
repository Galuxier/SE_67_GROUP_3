// Notification component for Navbar
import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNotificationPolling } from "../hooks/useNotificationsPolling";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationPolling(5000); // Polling every 5 seconds

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return "📦";
      case "event":
        return "🎪";
      case "course":
        return "📚";
      case "enrollment":
        return "📝";
      default:
        return "🔔";
    }
  };

  // Format notification date
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        type="button"
        className="relative rounded-full p-2 text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleNotifications}
      >
        <BellIcon className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-10 mt-2 w-80 max-h-96 overflow-y-auto origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black/5 focus:outline-none divide-y divide-border"
          >
            <div className="p-3 flex justify-between items-center">
              <h3 className="text-text font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary hover:text-secondary transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="py-1 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center text-text/70">
                  <div className="animate-spin h-6 w-6 border-t-2 border-primary border-r-2 rounded-full mx-auto mb-2"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-text/70">
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification._id);
                      }
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={notification.action_url || "#"}
                          className="block text-sm font-medium text-text"
                        >
                          {notification.title}
                        </Link>
                        <p className="text-xs text-text/70 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text/50 mt-1">
                          {formatNotificationDate(notification.create_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="ml-2 mt-1 w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 text-center">
              <button className="text-sm text-primary hover:text-secondary transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;