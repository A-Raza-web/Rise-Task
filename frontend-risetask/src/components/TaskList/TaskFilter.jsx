import React from "react";
import { FaSearch, FaListAlt, FaClock, FaCheck } from "react-icons/fa";

const TaskFilter = ({ filter, setFilter, searchQuery, setSearchQuery }) => {
  return (
    <div className="row mb-4 align-items-center">
      {/* Custom Styles */}
      <style>
        {`
          /* Search input */
          .form-control:focus {
            border-color: #f19952ff !important;
            box-shadow: 0 0 0 0.25rem rgba(253, 126, 20, 0.4) !important;
          }

          .filter-group {
            display: flex;
            gap: 8px;
          }
          .filter-btn {
            flex: 1;
            padding: 10px 16px;
            border-radius: 50px;
            border: none;
            color: #fd7e14;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .filter-btn.active {
            background: #fd7e14;
            color: white;
          }

        `}
      </style>

      {/* Search Bar */}
      <div className="col-md-6 mb-2 mb-md-0">
        <div className="input-group">
          <span
            className="input-group-text"
            style={{ backgroundColor: "#fd7e14", color: "white" }}
          >
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="col-md-6">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <FaListAlt /> All
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            <FaClock /> Pending
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            <FaCheck /> Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
