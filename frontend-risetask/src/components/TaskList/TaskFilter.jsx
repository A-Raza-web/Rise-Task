import React from "react";
import { FaSearch, FaFilter, FaListAlt, FaClock, FaCheck } from "react-icons/fa";

const TaskFilter = ({ filter, setFilter, showDropdown, setShowDropdown, searchQuery, setSearchQuery }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-8">
        <div className="input-group">
          <span className="input-group-text" style={{ backgroundColor: "#fd7e14", color: "white" }}>
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
      <div className="col-md-4 position-relative">
        <button className="btn text-white w-100" style={{ backgroundColor: "#fd7e14" }} onClick={() => setShowDropdown(!showDropdown)}>
          <FaFilter className="me-2" />
          {filter === "all" && "All Tasks"}
          {filter === "pending" && "Pending"}
          {filter === "completed" && "Completed"}
        </button>
        {showDropdown && (
          <ul className="list-group position-absolute w-100 shadow mt-1 z-3">
            <li className="list-group-item" onClick={() => setFilter("all")}>
              <FaListAlt className="me-2 text-warning" /> All Tasks
            </li>
            <li className="list-group-item" onClick={() => setFilter("pending")}>
              <FaClock className="me-2 text-warning" /> Pending
            </li>
            <li className="list-group-item" onClick={() => setFilter("completed")}>
              <FaCheck className="me-2 text-success" /> Completed
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
