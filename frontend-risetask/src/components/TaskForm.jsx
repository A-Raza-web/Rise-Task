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
  FaTag,
  FaBell,
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
  
  // یہاں پر ڈیفالٹ کیٹیگریز شامل کی گئی ہیں
  const [categories, setCategories] = useState([
    { _id: 'default1', name: 'General' },
    { _id: 'default2', name: 'Work' },
    { _id: 'default3', name: 'Personal' },
    { _id: 'default4', name: 'Study' },
    { _id: 'default5', name: 'Shopping' },
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const API_URL = "http://localhost:3000/api/tasks";
  const orange = "#fd7e14";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      if (response.data.success && response.data.data.length > 0) {
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
        tags: tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
        notifications: {
          enabled: notificationsEnabled,
          reminderTime: reminderTime,
        },
      };

      const response = await axios.post(API_URL, taskData);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create task");
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
      document.querySelector(".task-form")?.prepend(successMessage);
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
  

  const getPriorityColor = (p) => {
    switch (p) {
      case "low":
        return "#28a745"; // green
      case "medium":
        return "#ffc107"; // yellow
      case "high":
        return "#dc3545"; // red
      case "urgent":
        return "#6f42c1"; // purple
      default:
        return "#6c757d"; // gray
    }
  };
  
  // نئی فنکشن جو کیٹیگری کے رنگ کے لیے ہے
  const getCategoryColor = (catName) => {
    const colors = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"]; // Bootstrap colors
    const hash = catName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 task-form card shadow-sm p-4 mb-4">
      <h4 className="mb-4 text-center task-form-title" style={{ color: orange }}>
        <FaPlusCircle className="me-2" /> Add a New Task
      </h4>

      {/* Submission Error */}
      {errors.submit && (
        <div className="alert alert-danger mb-3 text-center fade-in" role="alert">
          {errors.submit}
        </div>
      )}

      {/* Task Details Section */}
      <div className="row mb-4">
        {/* Task Title */}
        <div className="col-md-6 task-form-group slide-in-left">
          <label htmlFor="taskTitle" className="form-label">
            <span className="task-form-icon-circle" style={{ backgroundColor: orange }}><FaTasks /></span> Task Title *
          </label>
          <input
            id="taskTitle"
            type="text"
            className={`form-control shadow-sm ${errors.title ? "is-invalid" : title ? "is-valid" : ""}`}
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
        <div className="col-md-6 task-form-group slide-in-right">
          <label htmlFor="taskDescription" className="form-label">
            <span className="task-form-icon-circle" style={{ backgroundColor: orange }}><FaStickyNote /></span> Description *
          </label>
          <textarea
            id="taskDescription"
            className={`form-control shadow-sm ${errors.description ? "is-invalid" : description ? "is-valid" : ""}`}
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task in detail..."
            maxLength="500"
            disabled={isSubmitting}
          />
          {errors.description && (<div className="invalid-feedback">{errors.description}</div>)}
          <div className="form-text">{description.length}/500 characters</div>
        </div>
      </div>

      {/* Priority & Due Date Section */}
      <h5 className="task-form-section-title" style={{ color: orange }}>
        <FaExclamationCircle className="me-2" /> Schedule & Priority
      </h5>
      <hr />
      <div className="row mb-4">
        {/* Priority Selector */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.3s' }}>
          <label className="form-label">Priority</label>
          <div className="d-flex flex-wrap gap-2">
            {['low', 'medium', 'high', 'urgent'].map(p => (
              <div
                key={p}
                className={`custom-priority-option ${p === priority ? 'active' : ''}`}
                style={{ backgroundColor: p === priority ? getPriorityColor(p) : 'white', color: p === priority ? 'white' : '#6c757d' }}
                onClick={() => setPriority(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Due Date Picker */}
        <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.4s' }}>
          <label htmlFor="taskDueDate" className="form-label">Due Date</label>
          <input
            id="taskDueDate"
            type="date"
            className="form-control shadow-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            disabled={isSubmitting}
          />
          <div className="form-text text-muted">Optional deadline for this task</div>
        </div>
      </div>

      {/* Category & Tags Section */}
      <h5 className="task-form-section-title" style={{ color: orange }}>
        <FaTag className="me-2" /> Organization
      </h5>
      <hr />
      <div className="row mb-4">
        {/* Category Selector */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.5s' }}>
          <label htmlFor="taskCategory" className="form-label">Category</label>
          <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className={`custom-priority-option ${cat.name === category ? 'active' : ''}`}
                  style={{
                    backgroundColor: cat.name === category ? getCategoryColor(cat.name) : 'white',
                    color: cat.name === category ? 'white' : '#6c757d',
                    borderColor: cat.name === category ? getCategoryColor(cat.name) : '#ccc'
                  }}
                  onClick={() => setCategory(cat.name)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
            <div className="form-text text-muted">Choose a category for better organization</div>
          </div>

          {/* Tags Input */}
            <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.6s' }}>
              <label htmlFor="taskTags" className="form-label">Tags</label>
              <input
                id="taskTags"
                type="text"
                className="form-control shadow-sm"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., work, personal, urgent"
                disabled={isSubmitting}
              />
              <div className="form-text text-muted">Add tags separated by commas for easy searching</div>
            </div>
          </div>
          <h5 className="task-form-section-title" style={{ color: orange }}>
      <FaBell className="me-2" /> Notifications
    </h5>
    <hr />
    <div className="row mb-4">
      <div className="col-md-6">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <label className="form-check-label">Enable Notifications</label>
        </div>
      </div>
      {notificationsEnabled && (
        <div className="col-md-6">
          <label className="form-label">Reminder Time (hours before)</label>
          <input
            type="number"
            className="form-control"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            min="1"
            max="72"
          />
        </div>
      )}
    </div>



      {/* Action Buttons Section */}
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4 fade-in" style={{ animationDelay: '0.8s' }}>
        <button type="submit" className="btn btn-orange-filled" disabled={isSubmitting || !title.trim() || !description.trim()}>
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span> Adding...
            </>
          ) : (
            <>
              <FaPlusCircle className="me-2" /> Add New Task
            </>
          )}
        </button>

        {(title || description) && (
          <button
            type="button"
            className="btn btn-orange-outline"
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
            <FaTrashAlt className="me-2" /> Clear Form
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;