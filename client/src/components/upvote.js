import React, { useState, useEffect } from 'react';

function IssueItem({ issue, token, userId }) {
  const [upvotes, setUpvotes] = useState(issue.upvotes || []);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Check if current user has already upvoted
    setIsUpvoted(upvotes.some(id => id === userId));
  }, [upvotes, userId]);

  const handleUpvote = async () => {
    setLoading(true);

    try {
      const url = isUpvoted
        ? `${API_BASE_URL}/api/issues/${issue._id}/remove-upvote`
        : `${API_BASE_URL}/api/issues/${issue._id}/upvote`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      const updatedIssue = await response.json();
      setUpvotes(updatedIssue.upvotes.map(id => id.toString())); // ensure strings
      setIsUpvoted(!isUpvoted);
    } catch (err) {
      console.error(err);
      alert('Error updating vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 16, marginBottom: 12, borderRadius: 8 }}>
      <h3>{issue.title}</h3>
      <p>{issue.description}</p>

      <button
        onClick={handleUpvote}
        disabled={loading}
        style={{
          backgroundColor: isUpvoted ? '#ff4500' : '#eee',
          color: isUpvoted ? '#fff' : '#000',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {isUpvoted ? 'Upvoted' : 'Upvote'} ({upvotes.length})
      </button>
    </div>
  );
}

export default IssueItem;
