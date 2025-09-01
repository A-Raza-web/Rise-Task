import React from "react";
import { FaEdit, FaTrash, FaCheckCircle, FaCalendarAlt, FaStar, FaExclamationTriangle, FaFire, FaFlag } from "react-icons/fa";
import TaskEditForm from "./TaskEditForm";

// Helper functions outside component for performance
const getPriorityData = (priority) => {
  switch (priority) {
    case "low":
      return { color: "#28a745", icon: <FaFlag style={{ color: "white" }} /> };
    case "medium":
      return { color: "#ffc107", icon: <FaStar style={{ color: "white" }} /> };
    case "high":
      return { color: "#fd7e14", icon: <FaExclamationTriangle style={{ color: "white" }} /> };
    case "urgent":
      return { color: "#ca1022ff", icon: <FaFire style={{ color: "white" }} /> };
    default:
      return { color: "#6c757d", icon: null };
  }
};

const TaskItem = ({ task, editId, setEditId, editTitle, setEditTitle, editDescription, setEditDescription, fetchTasks, API_URL }) => {
  const { _id, title, description, completed, priority, createdAt, updatedAt } = task;
  const { color, icon } = getPriorityData(priority);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await fetch(`${API_URL}/api/tasks/${_id}`, { method: "DELETE" });
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  const handleToggleComplete = async () => {
    try {
      await fetch(`${API_URL}/api/tasks/${_id}/toggle`, { method: "PATCH" });
      fetchTasks();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const startEdit = () => {
    setEditId(_id);
    setEditTitle(title);
    setEditDescription(description);
  };

  return (
   <div className="col-12 col-md-6 col-lg-4 mb-3 px-1">    
      <div className={`card shadow-sm border border-light card-task-hover priority-${priority} ${completed ? "bg-success bg-opacity-10" : ""}`}>
        <div className="card-body">
          {editId === _id ? (
            <TaskEditForm {...{ task, API_URL, fetchTasks, setEditId, editTitle, setEditTitle, editDescription, setEditDescription }} />
          ) : (
            <>
              {/* Task Details Section */}
              <div className="mb-2">
                <div className="d-flex align-items-center mb-1">
                  <span className="badge d-flex align-items-center me-2 p-2" style={{ backgroundColor: color, color: "white" }}>
                    {icon}
                    <span className="ms-1">{priority.toUpperCase()}</span>
                  </span>
                  <h5 className={`fw-bold mb-0 ${completed ? "text-decoration-line-through text-muted" : ""}`}>
                    {title}
                  </h5>
                </div>
                <p className="mb-1 text-muted">{description}</p>
                <small className="text-muted">
                  <FaCalendarAlt className="me-1" /> {new Date(createdAt || updatedAt).toLocaleDateString()}
                </small>
              </div>

              {/* Action Buttons Section */}
              <div className="d-flex flex-column flex-sm-row gap-2 mt-auto">
                <button className={`btn btn-sm ${completed ? "btn-outline-secondary" : "btn-outline-success"}`} onClick={handleToggleComplete}>
                  <FaCheckCircle className="me-1" /> {completed ? "Mark Pending" : "Mark Complete"}
                </button>
                <button className="btn btn-outline-warning btn-sm" onClick={startEdit}>
                  <FaEdit className="me-1" /> Edit
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                  <FaTrash className="me-1" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;