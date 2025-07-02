import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
//import { getPriorityLevel } from '../utils/priority';  // shared function

const getPriorityLevel = (upvotesCount) => {
    if (upvotesCount >= 7) return 'High';
    if (upvotesCount >= 3) return 'Medium';
    return 'Low';
  };

const Piechart = () => {
  const [issues, setIssues] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/issues')
      .then(res => res.json())
      .then(data => {
        setIssues(data);

        // Count how many issues fall into each priority
        const counts = { Low: 0, Medium: 0, High: 0 };
        data.forEach(issue => {
          const level = getPriorityLevel(issue.upvotes.length);
          counts[level]++;
        });

        // Prepare data for PieChart
        setPriorityData([
          { name: 'Low', value: counts.Low },
          { name: 'Medium', value: counts.Medium },
          { name: 'High', value: counts.High },
        ]);
      })
      .catch(console.error);
  }, []);

  const COLORS = ['#28a745', '#ffc107', '#dc3545']; // green, yellow, red

  return (
    <div>
      <h2>Issue Priorities</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={priorityData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {priorityData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Piechart;
