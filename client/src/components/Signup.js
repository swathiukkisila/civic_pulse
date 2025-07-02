import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('phone', form.phone);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
        }}
      >
        <h2 className="mb-4 text-center text-primary">Signup</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            className="form-control mb-3"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <div className="mb-3">
            <label htmlFor="avatar" className="form-label">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Signup
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-primary">
            Login here
          </a>
        </p>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default Signup;
