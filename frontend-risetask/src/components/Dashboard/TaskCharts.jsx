// TaskCharts.js
import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FaChartPie, FaCalendar } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TaskCharts = ({ doughnutData, doughnutOptions, barData }) => {
  const orange = { color: "#fd7e14" };

  return (
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
  );
};

export default TaskCharts;