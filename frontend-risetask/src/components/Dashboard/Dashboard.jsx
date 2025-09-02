// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChartPie, FaTasks, FaCheckCircle, FaClock, FaCalendarDay } from "react-icons/fa";
import StatsCard from "./StatsCard";
import TaskCharts from "./TaskCharts";
import CategoriesList from "./CategoriesList";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todayTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
    categories: [],
    priorities: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks/stats');
      if (response.data.success) {
        const { overview, categories, priorities } = response.data.data;
        setStats({
          totalTasks: overview.totalTasks,
          completedTasks: overview.completedTasks,
          pendingTasks: overview.pendingTasks,
          todayTasks: overview.todayTasks,
          overdueTasks: overview.overdueTasks,
          inProgressTasks: overview.inProgressTasks,
          categories,
          priorities
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setStats({
        totalTasks: 45,
        completedTasks: 28,
        pendingTasks: 12,
        inProgressTasks: 5,
        todayTasks: 3,
        overdueTasks: 7,
        categories: [
          { name: 'Work', count: 15 },
          { name: 'Personal', count: 20 },
          { name: 'Shopping', count: 10 }
        ],
      });
    }
  };

  const doughnutData = {
    labels: ['Completed', 'Pending', 'In Progress'],
    datasets: [{
      data: [stats.completedTasks, stats.pendingTasks, stats.inProgressTasks],
      backgroundColor: ['#28a745', '#ffc107', '#007bff'],
      hoverBackgroundColor: ['#218838', '#d39e00', '#0056b3'],
      borderWidth: 2
    }]
  };
  
  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks Completed',
      data: [5, 8, 3, 9, 6, 4, 7],
      backgroundColor: '#007bff',
      borderRadius: 4
    }]
  };
  
  const orange = { color: "#fd7e14" };

  return (
    <div className="container mt-4 dashboard-container">
      <h2 className="mb-4"><FaChartPie className="me-2" style={orange} /> Dashboard</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <StatsCard title="Total Tasks" value={stats.totalTasks} icon={FaTasks} color="primary-gradient" />
        <StatsCard title="Completed" value={stats.completedTasks} icon={FaCheckCircle} color="success" />
        <StatsCard title="Pending" value={stats.pendingTasks} icon={FaClock} color="warning" />
        <StatsCard title="Today" value={stats.todayTasks} icon={FaCalendarDay} color="info" />
      </div>

      <TaskCharts doughnutData={doughnutData} doughnutOptions={doughnutOptions} barData={barData} />
      
      <CategoriesList categories={stats.categories} />
      
    </div>
  );
};

export default Dashboard;