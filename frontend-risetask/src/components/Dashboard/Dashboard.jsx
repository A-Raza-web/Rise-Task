// Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChartPie, FaTasks, FaCheckCircle, FaClock, FaCalendarDay, FaExclamationCircle } from "react-icons/fa";
import StatsCard from "./StatsCard";
import TaskCharts from "./TaskCharts";
import CategoriesList from "./CategoriesList";
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
    
    // Data for the Task Status Doughnut Chart
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

    // Data for the Weekly Progress Bar Chart
    const barData = {
        labels: stats.weeklyLabels,
        datasets: [{
            label: 'Tasks Completed',
            data: stats.weeklyProgress,
            backgroundColor: '#007bff',
            borderRadius: 4
        }]
    };
    
    // Data for the Categories Doughnut Chart
    const categoryDoughnutData = {
        labels: stats.categories.map(cat => cat.name),
        datasets: [{
            data: stats.categories.map(cat => cat.taskCount),
            backgroundColor: stats.categories.map(cat => cat.color),
            hoverOffset: 4,
            borderWidth: 1,
        }]
    };
    
    const categoryDoughnutOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom' },
            tooltip: { enabled: true }
        }
    };

    const orange = { color: "#fd7e14" };

    return (
        <div className="container mt-4 dashboard-container">
            <h2 className="mb-4"><FaChartPie className="me-2" style={orange} /> Dashboard</h2>
                        
            <div className="row mb-4">
                <StatsCard title="Total Tasks" value={stats.overview.totalTasks} icon={FaTasks} color="primary-gradient" />
                <StatsCard title="Completed" value={stats.overview.completedTasks} icon={FaCheckCircle} color="success" />
                <StatsCard title="Pending" value={stats.overview.pendingTasks} icon={FaClock} color="warning" />
                <StatsCard title="Overdue" value={stats.overview.overdueTasks} icon={FaExclamationCircle} color="danger" />
            </div>

            <TaskCharts 
                doughnutData={doughnutData} 
                doughnutOptions={doughnutOptions} 
                barData={barData} 
                categoryDoughnutData={categoryDoughnutData}
                categoryDoughnutOptions={categoryDoughnutOptions}
            />
            
            <CategoriesList categories={stats.categories} />
            
        </div>
    );
};

export default Dashboard;