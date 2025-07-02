import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const IssueDetailPage = () => {
  const { issueId } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  // Upvote states
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(0);

  // Fetch issue details on load or when issueId changes
  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/issues/${issueId}`);

        setIssue(res.data);
        setHasUpvoted(
          res.data.upvotes && res.data.upvotes.includes(getCurrentUserId())
        );
        setUpvotesCount(res.data.upvotes ? res.data.upvotes.length : 0);
      } catch (err) {
        console.error('Failed to fetch issue details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
    setShowUserDetails(false);
    setShowComments(false);
    setComments([]);
  }, [issueId]);

  // Fetch comments when toggled
  useEffect(() => {
    if (!showComments) return;

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/issues/${issueId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [showComments, issueId]);

  // Helper: get current user ID from token or local storage (adjust based on your auth system)
  function getCurrentUserId() {
    // For example, if you store user in localStorage after login:
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const userObj = JSON.parse(userStr);
      return userObj._id || null;
    } catch {
      return null;
    }
  }

  const handleUpvote = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upvote.');
      return;
    }

    try {
      if (!hasUpvoted) {
        await axios.post(
          `http://localhost:5000/api/issues/${issueId}/upvote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasUpvoted(true);
        setUpvotesCount((count) => count + 1);
      } else {
        await axios.post(
          `http://localhost:5000/api/issues/${issueId}/remove-upvote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasUpvoted(false);
        setUpvotesCount((count) => count - 1);
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      alert('Failed to update upvote. Please try again.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPostingComment(true);
    try {
      await axios.post(
        `http://localhost:5000/api/issues/${issueId}/comments`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewComment('');
      const res = await axios.get(`http://localhost:5000/api/issues/${issueId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Please login.');
    } finally {
      setPostingComment(false);
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        Loading issue...
      </div>
    );
  if (!issue)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        Issue not found.
      </div>
    );

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}
    >
      <h1
        className="mb-4 text-center"
        style={{ fontSize: '2.5rem', fontWeight: '700' }}
      >
        {issue.title}
      </h1>

      <p className="fs-5 text-center">
        <strong>Status:</strong>{' '}
        <span className={`badge ${getStatusColor(issue.status)}`}>
          {issue.status}
        </span>
      </p>

      <p className="fs-5">
        <strong>Description:</strong> {issue.description}
      </p>
      <p className="fs-5">
        <strong>Location:</strong> {issue.location}
      </p>
      <p className="fs-6 text-muted">
        <strong>Reported On:</strong>{' '}
        {new Date(issue.dateReported).toLocaleString()}
      </p>

      {issue.imageUrl && (
        <div className="mt-4 w-100 d-flex justify-content-center">
          <img
            src={`http://localhost:5000${issue.imageUrl}`}
            alt="Issue"
            style={{
              maxWidth: '100%',
              maxHeight: '450px',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </div>
      )}

      {/* Upvote Button */}
      <div className="mt-4 d-flex justify-content-center align-items-center gap-3">
        <button
          className={`btn btn-lg ${
            hasUpvoted ? 'btn-success' : 'btn-outline-success'
          }`}
          onClick={handleUpvote}
        >
          {hasUpvoted ? 'Upvoted' : 'Upvote'}
        </button>
        <span>{upvotesCount} {upvotesCount === 1 ? 'Upvote' : 'Upvotes'}</span>
      </div>

      {/* Buttons */}
      <div className="mt-4 d-flex gap-3 justify-content-center w-100">
        <button
          className="btn btn-lg btn-outline-primary"
          onClick={() => setShowUserDetails((prev) => !prev)}
          aria-expanded={showUserDetails}
        >
          {showUserDetails ? 'Hide User Details' : 'Show User Details'}
        </button>

        <button
          className="btn btn-lg btn-outline-secondary"
          onClick={() => setShowComments((prev) => !prev)}
          aria-expanded={showComments}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* User Details */}
      {showUserDetails && issue.user && (
        <div className="border rounded p-4 mt-4 bg-light w-100 text-center">
          <h4>User Details</h4>
          <p>
            <strong>Name:</strong> {issue.user.name}
          </p>
          <p>
            <strong>Email:</strong> {issue.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {issue.user.phone || 'N/A'}
          </p>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="border rounded p-4 mt-4 bg-light w-100">
          <h4>Comments</h4>
          {loadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border rounded p-3 mb-3">
                <p>
                  <strong>{comment.user?.name || 'Anonymous'}</strong> says:
                </p>
                <p>{comment.text}</p>
                <small className="text-muted">
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="mt-3">
            <textarea
              className="form-control"
              placeholder="Write your comment..."
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={postingComment}
            />
            <button
              type="submit"
              className="btn btn-primary btn-lg mt-3"
              disabled={postingComment}
            >
              {postingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-warning text-dark';
    case 'Resolved':
      return 'bg-success';
    case 'Rejected':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

export default IssueDetailPage;
