import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserShield,
  FaTachometerAlt,
  FaClipboardList,
  FaPlusCircle,
  FaIdBadge,
  FaHome,
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotificationBell from './NotificationBell'; // ✅ Imported here

const Navbar = () => {
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        backgroundColor:"white",
        borderBottom: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div className="container">
        {/* Logo and Branding */}
        <Link className="navbar-brand d-flex align-items-center fw-bold text-primary" to="/">
        <img 
          src="/logo.jpeg" 
          alt="Civic Pulse Logo" 
          style={{ 
            height: "40px", 
            width: "40px", 
            borderRadius: "50%", 
            objectFit: "cover" 
          }} 
        />
          Civic Pulse
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>

            {userToken && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/dashboard">
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/all-issues">
                    <FaClipboardList className="me-1" /> All Issues
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/my-issues">
                    <FaClipboardList className="me-1" /> My Issues
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/report">
                    <FaPlusCircle className="me-1" /> Report Issue
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/profile">
                    <FaIdBadge className="me-1" /> Profile
                  </Link>
                </li>
                <li className="nav-item">
                <NotificationBell />
              </li>
              </>
            )}

            {adminToken && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/admin/dashboard">
                    <FaUserShield className="me-1" /> Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/admin/issues">
                    <FaClipboardList className="me-1" /> View All Issues
                  </Link>
                </li>
              </>
            )}

            {(userToken || adminToken) ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary btn-sm" to="/login">
                    <FaSignInAlt className="me-1" /> User Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-secondary btn-sm" to="/admin/login">
                    <FaUserShield className="me-1" /> Admin Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
