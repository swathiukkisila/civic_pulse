// CommentSection.jsx
import React, { useEffect, useState } from 'react';

const CommentSection = ({ issueId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issueId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [issueId]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!res.ok) throw new Error('Failed to add comment');

      const savedComment = await res.json();
      setComments([...comments, savedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to post comment');
    }
  };

  return (
    <div className="mt-3">
      <h6 className="fw-bold">💬 Comments</h6>
      <div className="mb-2">
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((comment, idx) => (
            <div key={idx} className="small text-muted mb-2">
              <strong>{comment.user?.name || 'User'}:</strong> {comment.text}
              <div className="text-secondary small">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-sm btn-primary" onClick={handleCommentSubmit}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
