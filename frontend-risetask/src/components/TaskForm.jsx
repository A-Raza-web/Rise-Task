import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskForm.css";
import {
  FaPlusCircle,
  FaTrashAlt,
  FaTasks,
  FaStickyNote,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(24);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const API_URL = "http://localhost:3000/api/tasks";

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Task title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        notifications: {
          enabled: notificationsEnabled,
          reminderTime: reminderTime
        }
      };

      const response = await axios.post(API_URL, taskData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create task');
      }

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCategory("General");
      setTags("");
      setNotificationsEnabled(true);
      setReminderTime(24);
      setErrors({});

      const successMessage = document.createElement("div");
      successMessage.className =
        "alert alert-success alert-dismissible fade show task-success-alert";
      successMessage.innerHTML = `
        <strong>Success!</strong> Task "${taskData.title}" has been added successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.querySelector(".card-body")?.prepend(successMessage);
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error("Add Error:", err.message);
      setErrors({ submit: "Failed to add task. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#064f37ff";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ff6b35";
      case "urgent":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 task-form mb-4">
      {/* Task Title & Description Section */}
      <div className="row">
        {/* Task Title */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.1s' }}>
          <label htmlFor="taskTitle" className="form-label">
            <span className="task-form-icon-circle">
              <FaTasks />
            </span>
            Task Title *
          </label>
          <input
            id="taskTitle"
            type="text"
            className={`form-control ${
              errors.title ? "is-invalid" : title ? "is-valid" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your task title..."
            maxLength="100"
            disabled={isSubmitting}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          <div className="form-text">{title.length}/100 characters</div>
        </div>

        {/* Description */}
        <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.2s' }}>
          <label htmlFor="taskDescription" className="form-label">
            <span className="task-form-icon-circle">
              <FaStickyNote />
            </span>
            Description *
          </label>
          <textarea
            id="taskDescription"
            className={`form-control ${
              errors.description ? "is-invalid" : description ? "is-valid" : ""
            }`}
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task in detail..."
            maxLength="500"
            disabled={isSubmitting}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
          <div className="form-text">{description.length}/500 characters</div>
        </div>
      </div>

      {/* Priority & Due Date Section */}
      <div className="row">
        {/* Priority Selector */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.3s' }}>
          <label htmlFor="taskPriority" className="form-label">
            <span className="task-form-icon-circle">
              <FaExclamationCircle />
            </span>
            Priority
          </label>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div
              className={`custom-priority-option low ${priority === 'low' ? 'active' : ''}`}
              onClick={() => setPriority('low')}
              data-priority="low"
            >
              Low Priority
            </div>
            <div
              className={`custom-priority-option medium ${priority === 'medium' ? 'active' : ''}`}
              onClick={() => setPriority('medium')}
              data-priority="medium"
            >
              Medium Priority
            </div>
            <div
              className={`custom-priority-option high ${priority === 'high' ? 'active' : ''}`}
              onClick={() => setPriority('high')}
              data-priority="high"
            >
              High Priority
            </div>
            <div
              className={`custom-priority-option urgent ${priority === 'urgent' ? 'active' : ''}`}
              onClick={() => setPriority('urgent')}
              data-priority="urgent"
            >
              Urgent
            </div>
          </div>
          <div className="form-text mt-2">
            <span
              className="badge rounded-pill px-3 py-1"
              style={{
                backgroundColor: getPriorityColor(priority),
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </span>
          </div>
        </div>

        {/* Due Date Picker */}
        <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.4s' }}>
          <label htmlFor="taskDueDate" className="form-label">
            <span className="task-form-icon-circle">
              <FaCalendarAlt />
            </span>
            Due Date
          </label>
          <input
            id="taskDueDate"
            type="date"
            className="form-control shadow-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            disabled={isSubmitting}
          />
          <div className="form-text mt-2 text-muted">
            Optional deadline for this task
          </div>
        </div>
      </div>

      {/* Category & Tags Section */}
      <div className="row">
        {/* Category Selector */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.5s' }}>
          <label htmlFor="taskCategory" className="form-label">
            <span className="task-form-icon-circle">
              <FaTasks />
            </span>
            Category
          </label>
          <select
            id="taskCategory"
            className="form-control shadow-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="form-text mt-2 text-muted">
            Choose a category for better organization
          </div>
        </div>

        {/* Tags Input */}
        <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.6s' }}>
          <label htmlFor="taskTags" className="form-label">
            <span className="task-form-icon-circle">
              <FaTasks />
            </span>
            Tags
          </label>
          <input
            id="taskTags"
            type="text"
            className="form-control shadow-sm"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas..."
            disabled={isSubmitting}
          />
          <div className="form-text mt-2 text-muted">
            Add tags for easy searching (e.g., urgent, work, personal)
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="row">
        <div className="col-12 task-form-group slide-in-up" style={{ animationDelay: '0.7s' }}>
          <label className="form-label">
            <span className="task-form-icon-circle">
              <FaCalendarAlt />
            </span>
            Notification Settings
          </label>
          <div className="card p-3 shadow-sm">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="notificationsEnabled"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                disabled={isSubmitting}
              />
              <label className="form-check-label" htmlFor="notificationsEnabled">
                Enable notifications for this task
              </label>
            </div>
            
            {notificationsEnabled && (
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="reminderTime" className="form-label">
                    Reminder Time (hours before due date)
                  </label>
                  <select
                    id="reminderTime"
                    className="form-control"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={6}>6 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>24 hours (1 day)</option>
                    <option value={48}>48 hours (2 days)</option>
                    <option value={72}>72 hours (3 days)</option>
                    <option value={168}>168 hours (1 week)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4 fade-in" style={{ animationDelay: '0.5s' }}>
        <button
          type="submit"
          className="btn-orange"
          disabled={isSubmitting || !title.trim() || !description.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status"></span>
              Adding...
            </>
          ) : (
            <>
              <FaPlusCircle /> Add New Task
            </>
          )}
        </button>

        {(title || description) && (
          <button
            type="button"
            className="btn-orange-outline"
            onClick={() => {
              setTitle("");
              setDescription("");
              setPriority("medium");
              setDueDate("");
              setCategory("General");
              setTags("");
              setNotificationsEnabled(true);
              setReminderTime(24);
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            <FaTrashAlt /> Clear Form
          </button>
        )}
      </div>

      {/* Submission Error */}
      {errors.submit && (
        <div className="alert alert-danger mt-3 text-center fade-in" style={{ animationDelay: '0.6s' }} role="alert">
          {errors.submit}
        </div>
      )}
    </form>
  );
};

export default TaskForm;