import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTasks,
  FaStar,
  FaFilter,
  FaListAlt,
  FaCheck,
  FaHourglassHalf,
  FaTrophy,
  FaCalendarAlt,
  FaTag,
  FaExclamationTriangle,
  FaBell
} from "react-icons/fa";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const API_URL = "http://localhost:3000/api/tasks";

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') {
        if (filter === 'completed') params.append('completed', 'true');
        if (filter === 'pending') params.append('completed', 'false');
      }
      if (categoryFilter) params.append('category', categoryFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await axios.get(`${API_URL}?${params.toString()}`);
      if (res.data.success) {
        setTasks(res.data.data);
      } else {
        console.error("Failed to fetch tasks:", res.data.message);
      }
    } catch (err) {
      console.error("❌ Load Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, searchQuery, sortBy, sortOrder, categoryFilter, priorityFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        fetchTasks();
      } else {
        console.error("Delete failed:", response.data.message);
      }
    } catch (err) {
      console.error("❌ Delete Error:", err.message);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle`);
      if (response.data.success) {
        fetchTasks();
      } else {
        console.error("Toggle failed:", response.data.message);
      }
    } catch (err) {
      console.error("❌ Toggle Error:", err.message);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editId}`, {
        title: editTitle,
        description: editDescription,
      });
      if (response.data.success) {
        setEditId(null);
        fetchTasks();
      } else {
        console.error("Update failed:", response.data.message);
      }
    } catch (err) {
      console.error("❌ Update Error:", err.message);
    }
  };

  const handleFilterSelect = (value) => {
    setFilter(value);
    setShowDropdown(false);
  };

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "#28a745";
      case "medium": return "#ffc107";
      case "high": return "#fd7e14";
      case "urgent": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent": return "🔥";
      case "high": return "⚡";
      case "medium": return "⭐";
      case "low": return "📝";
      default: return "📝";
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  // Since filtering is now done on the backend, we don't need to filter here
  const filteredTasks = tasks;
  return (
    <div className="pt-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: '#fd7e14', color: 'white' }}>
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
          <div className="input-group">
            <button
              className="btn text-white w-100"
              style={{ backgroundColor: '#fd7e14' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaFilter className="me-2" />
              {filter === "all" && "All Tasks"}
              {filter === "pending" && "Pending"}
              {filter === "completed" && "Completed"}
            </button>
          </div>

          {showDropdown && (
            <ul className="list-group position-absolute w-100 shadow mt-1 z-3">
              <li
                className={`list-group-item list-group-item-action ${filter === "all" ? "active" : ""}`}
                onClick={() => handleFilterSelect("all")}
                style={{ cursor: "pointer" }}
              >
                <FaListAlt className="me-2 text-warning" />
                All Tasks
              </li>
              <li
                className={`list-group-item list-group-item-action ${filter === "pending" ? "active" : ""}`}
                onClick={() => handleFilterSelect("pending")}
                style={{ cursor: "pointer" }}
              >
                <FaClock className="me-2 text-warning" />
                Pending
              </li>
              <li
                className={`list-group-item list-group-item-action ${filter === "completed" ? "active" : ""}`}
                onClick={() => handleFilterSelect("completed")}
                style={{ cursor: "pointer" }}
              >
                <FaCheck className="me-2 text-success" />
                Completed
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-light border-0 shadow-sm">
            <div className="card-body py-3">
              <FaTasks className="text-orange fs-4 mb-2" />
              <h5>{tasks.length}</h5>
              <small className="text-muted">Total Tasks</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light border-0 shadow-sm">
            <div className="card-body py-3">
              <FaCheckCircle className="text-success fs-4 mb-2" />
              <h5>{tasks.filter((t) => t.completed).length}</h5>
              <small className="text-muted">Completed</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light border-0 shadow-sm">
            <div className="card-body py-3">
              <FaHourglassHalf className="text-warning fs-4 mb-2" />
              <h5>{tasks.filter((t) => !t.completed).length}</h5>
              <small className="text-muted">Pending</small>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-5">
          <FaTrophy className="display-3 text-muted mb-3" />
          <h5 className="text-muted">{searchQuery ? "No tasks found" : "No tasks yet!"}</h5>
        </div>
      ) : (
        <div className="row">
          {filteredTasks.map((task) => (
            <div key={task._id} className="col-12 mb-3">
              <div className={`card shadow-sm ${task.completed ? "bg-success bg-opacity-10" : ""}`}>
                <div className="card-body">
                  {editId === task._id ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        className="form-control mb-2"
                        rows="2"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={saveEdit}>💾 Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>❌ Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className={`fw-bold mb-1 ${task.completed ? "text-decoration-line-through text-muted" : ""}`}>
                          {task.title}
                        </h5>
                        <div className="d-flex gap-2 align-items-center">
                          {/* Priority Badge */}
                          <span
                            className="badge px-2 py-1"
                            style={{
                              backgroundColor: getPriorityColor(task.priority || 'medium'),
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          >
                            {getPriorityIcon(task.priority || 'medium')} {(task.priority || 'medium').toUpperCase()}
                          </span>
                          
                          {/* Category Badge */}
                          <span className="badge bg-secondary px-2 py-1" style={{ fontSize: '0.75rem' }}>
                            <FaTag className="me-1" /> {task.category || 'General'}
                          </span>
                        </div>
                      </div>

                      <p className="mb-2 text-muted">{task.description}</p>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="mb-2">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.7rem' }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="mb-2">
                          <small className={`d-flex align-items-center ${isOverdue(task.dueDate) ? 'text-danger fw-bold' : 'text-info'}`}>
                            <FaCalendarAlt className="me-1" />
                            {formatDueDate(task.dueDate)}
                            {isOverdue(task.dueDate) && <FaExclamationTriangle className="ms-1" />}
                          </small>
                        </div>
                      )}

                      {/* Notifications */}
                      {task.notifications?.enabled && (
                        <div className="mb-2">
                          <small className="text-muted d-flex align-items-center">
                            <FaBell className="me-1" />
                            Notifications enabled ({task.notifications.reminderTime}h before due)
                          </small>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <button
                            className={`btn btn-sm me-2 ${task.completed ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                            onClick={() => handleToggleComplete(task._id)}
                          >
                            <FaCheckCircle /> {task.completed ? 'Mark Pending' : 'Mark Complete'}
                          </button>
                          <button className="btn btn-outline-warning btn-sm me-2" onClick={() => startEdit(task)}>
                            <FaEdit /> Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(task._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" /> {new Date(task.createdAt || task.updatedAt).toLocaleDateString()}
                        </small>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="mt-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-bold">Overall Progress</span>
            <span className="fw-bold text-orange">
              {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
            </span>
          </div>
          <div className="progress" style={{ height: "10px" }}>
            <div
              className="progress-bar bg-orange progress-bar-striped progress-bar-animated"
              style={{ width: `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
