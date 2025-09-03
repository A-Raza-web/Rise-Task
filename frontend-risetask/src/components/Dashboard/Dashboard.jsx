// Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChartPie, FaTasks, FaCheckCircle, FaClock, FaCalendarDay } from "react-icons/fa";
import StatsCard from "./StatsCard";
import TaskCharts from "./TaskCharts";
import CategoriesList from "./CategoriesList"; // Import the CategoriesList component
import "./Dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState({
        overview: {
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            todayTasks: 0,
            overdueTasks: 0,
            inProgressTasks: 0,
        },
        categories: [],
        weeklyProgress: [],
        weeklyLabels: [],
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
            // Fallback data
        }
    };
    
    // ... (Your chart data and options remain the same) ...

    const doughnutData = {
        labels: ['Completed', 'Pending', 'In Progress'],
        datasets: [{
            data: [stats.overview.completedTasks, stats.overview.pendingTasks, stats.overview.inProgressTasks],
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
        labels: stats.weeklyLabels,
        datasets: [{
            label: 'Tasks Completed',
            data: stats.weeklyProgress,
            backgroundColor: '#007bff',
            borderRadius: 4
        }]
    };
    
    const orange = { color: "#fd7e14" };

    return (
        <div className="container mt-4 dashboard-container">
            <h2 className="mb-4"><FaChartPie className="me-2" style={orange} /> Dashboard</h2>
            
            <div className="row mb-4">
                <StatsCard title="Total Tasks" value={stats.overview.totalTasks} icon={FaTasks} color="primary-gradient" />
                <StatsCard title="Completed" value={stats.overview.completedTasks} icon={FaCheckCircle} color="success" />
                <StatsCard title="Pending" value={stats.overview.pendingTasks} icon={FaClock} color="warning" />
                <StatsCard title="Today" value={stats.overview.todayTasks} icon={FaCalendarDay} color="info" />
            </div>

            <TaskCharts doughnutData={doughnutData} doughnutOptions={doughnutOptions} barData={barData} />
            
            {/* Pass the categories data as a prop */}
            <CategoriesList categories={stats.categories} />
            
        </div>
    );
};

export default Dashboard;