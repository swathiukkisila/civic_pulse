import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('adminToken', data.token);
      alert('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)', // light blue to white gradient
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: '#fefefe',
          padding: '35px 25px',
          borderRadius: '14px',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #d3dce6',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '28px', color: '#1976d2', fontWeight: '700' }}>
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1976d2' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.6px solid #b0bec5',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                outlineColor: '#64b5f6',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#64b5f6')}
              onBlur={(e) => (e.target.style.borderColor = '#b0bec5')}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1976d2' }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.6px solid #b0bec5',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                outlineColor: '#64b5f6',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#64b5f6')}
              onBlur={(e) => (e.target.style.borderColor = '#b0bec5')}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#1976d2',
              border: 'none',
              color: 'white',
              padding: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1565c0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
