import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    location: '',
    status: '',
  });

  const [visibleComments, setVisibleComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/issues/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/issues/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete issue');
      setIssues(issues.filter((issue) => issue._id !== id));
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
      setIssues(issues.map((issue) => (issue._id === id ? updatedIssue : issue)));
      setEditingIssueId(null);
    } catch (error) {
      console.error(error);
      alert('Error updating issue');
    }
  };

  const toggleComments = (id) => {
    setVisibleComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        paddingTop: '50px',
        paddingBottom: '50px',
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center text-primary fw-bold">📋 Reported Issues</h2>
        {issues.length === 0 ? (
          <p className="text-center text-muted">No issues reported yet.</p>
        ) : (
          <div className="row gy-4">
            {issues.map((issue) => (
              <div key={issue._id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
                  {/* Image with Link */}
                  {issue.imageUrl && (
                    <Link to={`/issues/${issue._id}`}>
                      <img
                        src={`http://localhost:5000${issue.imageUrl}`}
                        alt="Reported"
                        className="card-img-top"
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px',
                        }}
                      />
                    </Link>
                  )}

                  <div className="card-body d-flex flex-column">
                    {editingIssueId === issue._id ? (
                      <>
                        <input
                          type="text"
                          name="title"
                          value={editData.title}
                          onChange={handleChange}
                          className="form-control mb-2"
                          placeholder="Title"
                        />
                        <textarea
                          name="description"
                          value={editData.description}
                          onChange={handleChange}
                          className="form-control mb-2"
                          placeholder="Description"
                        />
                        <input
                          type="text"
                          name="location"
                          value={editData.location}
                          onChange={handleChange}
                          className="form-control mb-2"
                          placeholder="Location"
                        />
                       <p className="text-muted mb-3"><strong>Status:</strong> {editData.status}</p>
                        <div className="d-flex">
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(issue._id)}
                          >
                            ✅ Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingIssueId(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={`/issues/${issue._id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h5 className="card-title text-primary fw-bold">{issue.title}</h5>
                        <p className="card-text">{issue.description}</p>
                        <ul className="list-unstyled small text-muted mb-3">
                          <li><strong>Status:</strong> {issue.status}</li>
                          <li><strong>Location:</strong> {issue.location}</li>
                          <li><strong>Date:</strong> {new Date(issue.dateReported).toLocaleDateString()}</li>
                        </ul>
                      </Link>
                    )}
                  </div>

                  {/* Buttons and Comments Section */}
                  <div className="card-body border-top pt-3 d-flex justify-content-between align-items-center">
                    <div>
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleDelete(issue._id)}
                      >
                        🗑 Delete
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(issue)}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => toggleComments(issue._id)}
                    >
                      {visibleComments[issue._id] ? 'Hide Comments' : 'Show Comments'}
                    </button>
                  </div>

                  {visibleComments[issue._id] && (
                    <div className="card-body">
                      <hr className="my-3" />
                      <CommentSection issueId={issue._id} />
                    </div>
                  )}
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
