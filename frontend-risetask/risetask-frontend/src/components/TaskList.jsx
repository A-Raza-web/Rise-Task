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

  const API_URL =
    "https://2a361bfc-2f48-42b0-8ad6-5d8d8fec30e4-00-3sdsdmlcu7b3u.sisko.replit.dev/api/tasks";

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Load Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("❌ Delete Error:", err.message);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditId(null);
      fetchTasks();
    } catch (err) {
      console.error("❌ Update Error:", err.message);
    }
  };

  const handleFilterSelect = (value) => {
    setFilter(value);
    setShowDropdown(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "completed") return matchesSearch && task.completed;
    if (filter === "pending") return matchesSearch && !task.completed;
    return matchesSearch;
  });
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
                      <h5 className={`fw-bold mb-1 ${task.completed ? "text-decoration-line-through text-muted" : ""}`}>{task.title}</h5>
                      <p className="mb-2 text-muted">{task.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <button className="btn btn-outline-warning btn-sm me-2" onClick={() => startEdit(task)}>
                            <FaEdit /> Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(task._id)}>
                            <FaTrashAlt /> Delete
                          </button>
                        </div>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" /> {new Date(task.createdAt).toLocaleDateString()}
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
            <span className="fw-bold text-orange">{progressPercent}%</span>
          </div>
          <div className="progress" style={{ height: "10px" }}>
            <div
              className="progress-bar bg-orange progress-bar-striped progress-bar-animated"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
