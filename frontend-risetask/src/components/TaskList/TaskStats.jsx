import React from "react";
import { FaTasks, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const TaskStats = ({ tasks }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <FaTasks className="fs-4 mb-2 text-warning" />
            <h5>{tasks.length}</h5>
            <small>Total Tasks</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <FaCheckCircle className="fs-4 mb-2 text-success" />
            <h5>{tasks.filter((t) => t.completed).length}</h5>
            <small>Completed</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <FaHourglassHalf className="fs-4 mb-2 text-warning" />
            <h5>{tasks.filter((t) => !t.completed).length}</h5>
            <small>Pending</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
