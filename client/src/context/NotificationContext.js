import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []); // ✅ Safe fallback
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setNotifications([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markNotificationAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setNotifications((prev) =>
          Array.isArray(prev)
            ? prev.map((notif) =>
                notif._id === id ? { ...notif, read: true } : notif
              )
            : []
        );
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter(n => !n.read).length
    : 0;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markNotificationAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
