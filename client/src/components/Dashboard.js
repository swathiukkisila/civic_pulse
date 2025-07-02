import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#f0ad4e', '#5cb85c', '#d9534f']; // Pending, Resolved, Rejected

const UserDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    resolved: 0,
    rejected: 0,
  });

  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch user stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
    AOS.init({ duration: 1000 });

    const intervalId = setInterval(() => {
      fetchStats();
    }, 10000);

    const handleStatusUpdate = () => {
      fetchStats();
    };
    window.addEventListener('issueStatusUpdated', handleStatusUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('issueStatusUpdated', handleStatusUpdate);
    };
  }, []);

  const chartData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Resolved', value: stats.resolved },
    { name: 'Rejected', value: stats.rejected },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '40px 20px',
        boxSizing: 'border-box',
      }}
    >
      <div className="container">
        <h2 className="mb-5 fw-bold text-center text-primary">📊 Your Issue Summary</h2>

        <div className="row g-4 justify-content-center">
          {/* Pending */}
          <div className="col-md-4" data-aos="fade-up">
            <div className="card shadow-sm border-start border-4 border-warning">
              <div className="card-body text-center">
                <h5 className="card-title text-warning fw-bold">⏳ Pending</h5>
                <p className="card-text fs-2 text-dark">
                  <CountUp end={stats.pending} duration={1.5} />
                </p>
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="150">
            <div className="card shadow-sm border-start border-4 border-success">
              <div className="card-body text-center">
                <h5 className="card-title text-success fw-bold">✅ Resolved</h5>
                <p className="card-text fs-2 text-dark">
                  <CountUp end={stats.resolved} duration={1.5} />
                </p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
            <div className="card shadow-sm border-start border-4 border-danger">
              <div className="card-body text-center">
                <h5 className="card-title text-danger fw-bold">❌ Rejected</h5>
                <p className="card-text fs-2 text-dark">
                  <CountUp end={stats.rejected} duration={1.5} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart Section */}
        <div className="mt-5" data-aos="zoom-in">
          <h4 className="text-center mb-4 fw-semibold text-secondary">📈 Visual Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
