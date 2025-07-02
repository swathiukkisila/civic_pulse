import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import { useNavigate } from 'react-router-dom';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload._id;
  } catch (e) {
    return null;
  }
};

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    location: '',
    status: '',
  });
  const [showUserDetailsId, setShowUserDetailsId] = useState(null);
  const [showCommentsId, setShowCommentsId] = useState(null);

  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  // Helper: get priority badge based on upvotes count
  const getPriorityBadge = (upvotesCount) => {
    if (upvotesCount >= 7)
      return <span className="badge bg-danger ms-2">High</span>;
    if (upvotesCount >= 3)
      return <span className="badge bg-warning text-dark ms-2">Medium</span>;
    return <span className="badge bg-success ms-2">Low</span>;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/issues')
      .then(res => res.json())
      .then(data => {
        // Sort by upvotes count descending
        const sortedIssues = data.sort((a, b) => b.upvotes.length - a.upvotes.length);
        setIssues(sortedIssues);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete issue');
      setIssues(issues.filter(issue => issue._id !== id));
    } catch (error) {
      console.error(error);
      alert('Error deleting issue');
    }
  };

  const handleEdit = (issue) => {
    setEditingIssueId(issue._id);
    setEditData({
      title: issue.title,
      description: issue.description,
      location: issue.location,
      status: issue.status,
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to update issue');
      const updatedIssue = await res.json();

      setIssues(prevIssues => {
        const updated = prevIssues.map(issue => (issue._id === id ? updatedIssue : issue));
        // Keep sorted by upvotes descending
        return updated.sort((a, b) => b.upvotes.length - a.upvotes.length);
      });

      setEditingIssueId(null);
    } catch (error) {
      console.error(error);
      alert('Error updating issue');
    }
  };

  const toggleUserDetails = (id) => {
    setShowUserDetailsId(prev => (prev === id ? null : id));
  };

  const toggleComments = (id) => {
    setShowCommentsId(prev => (prev === id ? null : id));
  };

  const handleUpvote = async (issueId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issueId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to upvote issue');
      const updatedIssue = await res.json();

      setIssues(prevIssues => {
        const updated = prevIssues.map(issue => (issue._id === issueId ? updatedIssue : issue));
        // Sort after update
        return updated.sort((a, b) => b.upvotes.length - a.upvotes.length);
      });
    } catch (error) {
      console.error(error);
      alert('Error upvoting issue');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
      <div className="container">
        <h2 className="text-center text-primary fw-bold mb-5">📋 Reported Issues</h2>
        {issues.length === 0 ? (
          <p className="text-center text-muted fs-5">No issues reported yet.</p>
        ) : (
          <div className="row gy-5">
            {issues.map(issue => (
              <div key={issue._id} className="col-md-6 col-lg-4">
                <div
                  className="issue-card"
                  onClick={() => navigate(`/issues/${issue._id}`)}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {issue.imageUrl && (
                    <img
                      src={`http://localhost:5000${issue.imageUrl}`}
                      alt="Reported"
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                  )}

                  <div
                    style={{ padding: '16px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {editingIssueId === issue._id ? (
                      <>
                        <input name="title" className="form-control mb-2" value={editData.title} onChange={handleChange} />
                        <textarea name="description" className="form-control mb-2" value={editData.description} onChange={handleChange} />
                        <input name="location" className="form-control mb-2" value={editData.location} onChange={handleChange} />
                        <p className="text-muted mb-3">
                          <strong>Status:</strong>{' '}
                          <span className={`badge ${editData.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {editData.status}
                          </span>
                        </p>

                        <div className="d-flex justify-content-between">
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdate(issue._id)}>✅ Save</button>
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingIssueId(null)}>❌ Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="fw-semibold text-dark">{issue.title}</h5>
                        <p className="text-muted">{issue.description}</p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span className={`badge ${issue.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {issue.status}
                          </span>
                        </p>
                        <p><strong>Location:</strong> {issue.location}</p>
                        <p><strong>Date:</strong> {new Date(issue.dateReported).toLocaleDateString()}</p>

                        <div className="d-flex align-items-center gap-3 my-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={(e) => handleUpvote(issue._id, e)}
                            disabled={issue.upvotes.includes(userId)}
                          >
                            👍 Upvote
                          </button>
                          <span>
                            <strong>{issue.upvotes.length}</strong> {issue.upvotes.length === 1 ? 'Vote' : 'Votes'}
                          </span>
                          {/* Priority Badge based on upvotes */}
                          {getPriorityBadge(issue.upvotes.length)}
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => toggleUserDetails(issue._id)}>
                            {showUserDetailsId === issue._id ? 'Hide User Details' : 'Show User Details'}
                          </button>
                          <button className="btn btn-outline-primary btn-sm" onClick={() => toggleComments(issue._id)}>
                            {showCommentsId === issue._id ? 'Hide Comments' : 'Show Comments'}
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(issue._id)}>🗑 Delete</button>
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(issue)}>✏️ Edit</button>
                        </div>

                        {showUserDetailsId === issue._id && issue.user && (
                          <div className="mt-3 bg-light p-2 rounded small">
                            <p><strong>Name:</strong> {issue.user.name}</p>
                            <p><strong>Email:</strong> {issue.user.email}</p>
                            <p><strong>Phone:</strong> {issue.user.phone}</p>
                          </div>
                        )}

                        {showCommentsId === issue._id && (
                          <div className="mt-3">
                            <CommentSection issueId={issue._id} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;
