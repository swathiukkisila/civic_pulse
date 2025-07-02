import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportIssueForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Pending');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('status', status);
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/issues`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Error reporting issue');

      alert('Issue reported successfully!');
      navigate('/issues');
    } catch (error) {
      console.error(error);
      alert('Failed to report issue');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: '#f0f2f5',
        padding: '40px 20px',
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="mb-4 text-center text-primary">📌 Report an Issue</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Issue Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Status</label>
            <input
              type="text"
              className="form-control"
              value="Pending"
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Image (optional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              🚀 Submit Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
