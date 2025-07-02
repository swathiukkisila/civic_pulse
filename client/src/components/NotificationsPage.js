import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext'; // adjust path

const NotificationsPage = () => {
  const { notifications, loading, markNotificationAsRead } = useNotifications();


  if (loading) return <div className="container mt-4">Loading notifications...</div>;

  const handleClick = async (notifId) => {
    await markNotificationAsRead(notifId);
  };

  return (
    <div className="container mt-4">
      <h3>Your Notifications</h3>
      <ul className="list-group mt-3">
        {notifications.length === 0 && <li className="list-group-item">No notifications</li>}
        {notifications.map((notif) => (
          <Link
            to={`/issues/${notif.issue}`}
            key={notif._id}
            onClick={() => handleClick(notif._id)}
            className="list-group-item list-group-item-action"
            style={{
              backgroundColor: notif.read ? '#fff' : '#e8f0fe',
              fontWeight: notif.read ? 'normal' : 'bold',
              color: '#000',
            }}
          >
            {notif.message}
            <br />
            <small className="text-muted">{new Date(notif.createdAt).toLocaleString()}</small>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
