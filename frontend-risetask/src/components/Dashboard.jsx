import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaCalendarDay, 
  FaPlus, 
  FaCalendar, 
  FaRobot, 
  FaDownload, 
  FaChartPie, 
  FaRocket
} from "react-icons/fa";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
      // Fallback to mock data for demonstration
      setStats({
        totalTasks: 45,
        completedTasks: 28,
        pendingTasks: 12,
        inProgressTasks: 5,
        todayTasks: 3,
        overdueTasks: 7,
      });
    }
  };

  const doughnutData = {
    labels: ['Completed', 'Pending', 'In Progress'],
    datasets: [{
      data: [stats.completedTasks, stats.pendingTasks, stats.inProgressTasks],
      backgroundColor: [
        '#28a745', // Success
        '#ffc107', // Warning
        '#007bff'  // Primary
      ],
      hoverBackgroundColor: [
        '#218838',
        '#d39e00',
        '#0056b3'
      ],
      borderWidth: 2
    }]
  };
  
  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // یہ لائن لیجنڈ کو ظاہر کرے گی
        position: 'bottom', // لیجنڈ کو چارٹ کے نیچے دکھائے گا
      },
      tooltip: {
        enabled: true, // ٹول ٹِپ کو فعال کرے گی
      }
    }
  };

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks Completed',
      data: [5, 8, 3, 9, 6, 4, 7], // یہ ڈیٹا فی الحال ہارڈ کوڈڈ ہے
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
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary-gradient shadow-sm border-0" style={{ backgroundColor: "#fd7e14" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Tasks</h6>
                  <h3>{stats.totalTasks}</h3>
                </div>
                <div className="align-self-center">
                  <FaTasks className="fa-2x opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Completed</h6>
                  <h3>{stats.completedTasks}</h3>
                </div>
                <div className="align-self-center">
                  <FaCheckCircle className="fa-2x opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pending</h6>
                  <h3>{stats.pendingTasks}</h3>
                </div>
                <div className="align-self-center">
                  <FaClock className="fa-2x opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Today</h6>
                  <h3>{stats.todayTasks}</h3>
                </div>
                <div className="align-self-center">
                  <FaCalendarDay className="fa-2x opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats & Charts Row */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header">
              <h5><FaChartPie className="me-2" style={orange} /> Task Distribution</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <div style={{ height: '300px', width: '300px' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header">
              <h5><FaCalendar className="me-2" style={orange} /> Weekly Progress</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <div style={{ height: '300px', width: '100%' }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header">
          <h5><FaRocket className="me-2" style={orange} /> Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <button className="btn btn-lg w-100 text-white" style={{ backgroundColor: "#fd7e14" }}>
                <FaPlus className="mb-2" /><br />
                Add Task
              </button>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-lg w-100 btn-outline-success">
                <FaCalendar className="mb-2" /><br />
                Schedule
              </button>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-lg w-100 btn-outline-info">
                <FaRobot className="mb-2" /><br />
                AI Assistant
              </button>
            </div>
            <div className="col-md-3 mb-3">
              <button className="btn btn-lg w-100 btn-outline-warning">
                <FaDownload className="mb-2" /><br />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;