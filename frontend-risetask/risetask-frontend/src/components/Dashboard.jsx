import React, { useState, useEffect } from "react";
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
import "./Dashboard.css"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todayTasks: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalTasks: 45,
      completedTasks: 28,
      pendingTasks: 17,
      todayTasks: 8
    });
  }, []);

  const doughnutData = {
    labels: ['Completed', 'Pending', 'In Progress'],
    datasets: [{
      data: [28, 12, 5],
      backgroundColor: [
        '#28a745',
        '#ffc107',
        '#17a2b8'
      ],
      borderWidth: 2
    }]
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
    <div className="container mt-4">
      <h2 className="mb-4"><FaChartPie className="me-2" style={orange} /> Dashboard</h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white" style={{ backgroundColor: "#fd7e14" }}>
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
          <div className="card bg-success text-white">
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
          <div className="card bg-warning text-white">
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
          <div className="card bg-info text-white">
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

      {/* Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Task Distribution</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Weekly Progress</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
       <div className="card mb-4"> 
          <div className="card">
            <div className="card-header">
              <h5><FaRocket className="me-2" style={orange} /> Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
               <div className="col-md-3 mb-3">
                <button className="btn btn-lg w-100 btn-orange">
                  <FaPlus className="mb-2" /><br />
                  Add Task
                </button>
              </div>


                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-success btn-lg w-100">
                    <FaCalendar className="mb-2" /><br />
                    Schedule
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info btn-lg w-100">
                    <FaRobot className="mb-2" /><br />
                    AI Assistant
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning btn-lg w-100">
                    <FaDownload className="mb-2" /><br />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
