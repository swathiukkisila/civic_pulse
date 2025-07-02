import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import IssuesList from './components/IssueList';
import MyIssues from './components/MyIssues';
import ReportIssueForm from './components/ReportIssueForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/Home';
import IssueDetailPage from './components/IssueDetailPage';
import NotificationsPage from './components/NotificationsPage';




function AppWrapper() {
  const location = useLocation();

  // Define routes where navbar should be hidden
  const hideNavbarRoutes = ['/', '/login', '/signup'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-issues" element={<IssuesList/>} />
        <Route path="/my-issues" element={<MyIssues/>} />
        <Route path="/report" element={<ReportIssueForm/>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/issues" element={<IssuesList />} />
        <Route path="/issues/:issueId" element={<IssueDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
