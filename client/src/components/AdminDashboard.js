import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);


const priorityColors = {
  Low: '#6c757d',
  Medium: '#fd7e14',
  High: '#dc3545',
};

const priorityOrder = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const getPriorityBadge = (upvotesCount) => {
  if (upvotesCount >= 7)
    return <span className="badge bg-danger ms-2">High</span>;
  if (upvotesCount >= 3)
    return <span className="badge bg-warning text-dark ms-2">Medium</span>;
  return <span className="badge bg-success ms-2">Low</span>;
};

const getPriorityFromUpvotes = (count) => {
  if (count >= 7) return 'High';
  if (count >= 3) return 'Medium';
  return 'Low';
};





const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [filteredPriority, setFilteredPriority] = useState('All');
  const [sortBy, setSortBy] = useState('None');
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  const fetchIssues = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/issues', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error('Failed to fetch issues', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`http://localhost:5000/api/issues/admin/issues/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setIssues((prev) => prev.map((issue) => (issue._id === id ? updated : issue)));
        window.dispatchEvent(new Event('issueStatusUpdated'));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating issue status', err);
    }
  };

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusCount = (status) =>
    issues.filter((issue) => issue.status === status).length;

    const getPriorityCount = (priority) =>
    issues.filter((issue) => getPriorityFromUpvotes(issue.upvotes?.length || 0) === priority).length;

    const getMonthlyTrends = () => {
      if (issues.length === 0) return [];
    
      // Step 1: Pick valid dates (prefer createdAt, fallback to dateReported)
      const validDates = issues
        .map((issue) => dayjs(issue.createdAt || issue.dateReported))
        .filter((date) => date.isValid());
    
      const minDate = dayjs.min(...validDates);
      const maxDate = dayjs.max(...validDates);
    
      // Step 2: Generate month keys
      const months = [];
      let current = minDate.startOf('month');
      const end = maxDate.startOf('month');
    
      while (current.isBefore(end) || current.isSame(end)) {
        months.push(current.format('YYYY-MM'));
        current = current.add(1, 'month');
      }
    
      // Step 3: Count issues per month
      const monthlyCount = {};
      issues.forEach((issue) => {
        const key = dayjs(issue.createdAt || issue.dateReported).format('YYYY-MM');
        monthlyCount[key] = (monthlyCount[key] || 0) + 1;
      });
    
      // Step 4: Format for recharts
      return months.map((monthKey) => ({
        monthKey,
        month: dayjs(monthKey).format('MMM YYYY'),
        count: monthlyCount[monthKey] || 0,
      }));
    };
    
    
  const filteredIssuesByStatus =
    filteredStatus === 'All'
      ? issues
      : issues.filter((issue) => issue.status === filteredStatus);


        const filteredIssues =
        filteredPriority === 'All'
          ? filteredIssuesByStatus
          : filteredIssuesByStatus.filter(
              (issue) => getPriorityFromUpvotes(issue.upvotes?.length || 0) === filteredPriority
            );
      

  const sortedIssues = [...filteredIssues];
  if (sortBy === 'Priority') {
    sortedIssues.sort((a, b) => {
      const priorityA = getPriorityFromUpvotes(a.upvotes?.length || 0);
      const priorityB = getPriorityFromUpvotes(b.upvotes?.length || 0);
      return priorityOrder[priorityB] - priorityOrder[priorityA]; // High to Low
    });
  } else if (sortBy === 'Upvotes') {
    sortedIssues.sort(
      (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0) // High to Low
    );
  }
  

  const lastIssueRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 5);
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  const getPieData = () => {
    return issues.map((issue) => ({
      name: `${issue.title} (${issue.priority || 'Low'})`,
      value: 1,
      fill: priorityColors[issue.priority || 'Low'],
    }));
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h3 className="mb-4 text-primary">Admin Dashboard</h3>

        {loading && (
          <div className="mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="mb-4 d-flex gap-3 flex-wrap">
          <span className="badge bg-dark p-2 px-3">Total: {issues.length}</span>
          <span className="badge bg-warning text-dark p-2 px-3">
            Pending: {getStatusCount('Pending')}
          </span>
          <span className="badge bg-success p-2 px-3">
            Resolved: {getStatusCount('Resolved')}
          </span>
          <span className="badge bg-danger p-2 px-3">
            Rejected: {getStatusCount('Rejected')}
          </span>
        </div>

        <div className="mb-5">
          <h5 className="mb-3 text-primary">Issue Trends (Monthly)</h5>
          <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getMonthlyTrends()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#007bff" strokeWidth={2} />
          </LineChart>

          </ResponsiveContainer>
        </div>


        <div className="mb-3 d-flex gap-3 flex-wrap align-items-center">
          <div>
            <label className="form-label me-2">Filter by Status:</label>
            <select
              className="form-select"
              style={{ width: '150px', display: 'inline-block' }}
              value={filteredStatus}
              onChange={(e) => {
                setFilteredStatus(e.target.value);
                setVisibleCount(5);
              }}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="form-label me-2">Filter by Priority:</label>
            <select
              className="form-select"
              style={{ width: '150px', display: 'inline-block' }}
              value={filteredPriority}
              onChange={(e) => {
                setFilteredPriority(e.target.value);
                setVisibleCount(5);
              }}
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="form-label me-2">Sort by:</label>
            <select
              className="form-select"
              style={{ width: '150px', display: 'inline-block' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="None">None</option>
              <option value="Priority">Priority (High to Low)</option>
              <option value="Upvotes">Upvotes (High to Low)</option>
            </select>
          </div>
        </div>

        {sortedIssues.slice(0, visibleCount).map((issue, index) => {
          const isLast = index === visibleCount - 1;
          const highlightPriority = issue.priority === 'Medium' || issue.priority === 'High';

          return (
            <div
              ref={isLast ? lastIssueRef : null}
              key={issue._id}
              className="card mb-4 shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: highlightPriority
                  ? `2px solid ${priorityColors[issue.priority]}`
                  : '1px solid #ccc',
                padding: '15px',
                boxShadow: highlightPriority
                  ? `0 0 10px ${priorityColors[issue.priority]}33`
                  : '0 0 5px #ccc',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <h5 style={{ marginBottom: 0 }}>{issue.title}</h5>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>{getPriorityBadge(issue.upvotes?.length || 0)}</div>

                </div>
              </div>

              <p>{issue.description}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  style={{
                    backgroundColor:
                      issue.status === 'Pending'
                        ? '#fff3cd'
                        : issue.status === 'Resolved'
                        ? '#d4edda'
                        : '#f8d7da',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    color: '#333',
                  }}
                >
                  {issue.status}
                </span>
              </p>

              {issue.status !== 'Rejected' ? (
                <div className="mt-2 d-flex gap-2 flex-wrap">
                  <button
                    style={{
                      backgroundColor: '#d1ecf1',
                      color: '#0c5460',
                      border: '1px solid #bee5eb',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      updateStatus(
                        issue._id,
                        issue.status === 'Pending' ? 'Resolved' : 'Pending'
                      )
                    }
                  >
                    Mark as {issue.status === 'Pending' ? 'Resolved' : 'Pending'}
                  </button>

                  <button
                    style={{
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      border: '1px solid #f5c6cb',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      const confirmReject = window.confirm(
                        'Are you sure you want to reject this issue?'
                      );
                      if (confirmReject) updateStatus(issue._id, 'Rejected');
                    }}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <p style={{ color: '#721c24', fontWeight: 'bold' }}>
                  This issue is rejected.
                </p>
              )}
            </div>
          );
        })}

        {!loading && sortedIssues.length === 0 && (
          <p className="text-center text-muted mt-5">No issues found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
