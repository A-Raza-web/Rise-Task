import React from "react";

const ProgressBar = ({ tasks }) => {
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = Math.round((completed / tasks.length) * 100);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between mb-2">
        <span className="fw-bold">Overall Progress</span>
        <span className="fw-bold text-orange">{percentage}%</span>
      </div>
      <div className="progress" style={{ height: "10px" }}>
        <div className="progress-bar bg-orange" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
