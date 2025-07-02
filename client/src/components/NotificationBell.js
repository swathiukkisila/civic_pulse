import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markNotificationAsRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = React.useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={bellRef} style={{ position: 'relative' }}>
      <button
        className="btn btn-link position-relative"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{ fontSize: '1.25rem', color: 'black' }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="dropdown-menu show p-2" style={{ right: 0, left: 'auto' }}>
          <h6 className="border-bottom pb-2">Notifications</h6>
          {notifications.length === 0 ? (
            <div className="text-muted">No notifications</div>
          ) : (
            <>
              {notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif._id}
                  className={`small dropdown-item ${notif.read ? '' : 'fw-bold'}`}
                  style={{ whiteSpace: 'normal', cursor: 'pointer' }}
                  onClick={() => {
                    markNotificationAsRead(notif._id);
                    navigate(`/issue/${notif.issueId}`);
                    setDropdownOpen(false);
                  }}
                >
                  {notif.message}
                  <br />
                  <small className="text-muted">
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
              <Link to="/notifications" className="d-block text-center pt-2">
                View All
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
