import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskForm.css";
import { FaPlusCircle } from "react-icons/fa";

import TaskTitleDescription from "./TaskTitleDescription.jsx";
import TaskPriorityDueDate from "./TaskPriorityDueDate.jsx";
import TaskCategoryTags from "./TaskCategoryTags.jsx";
import TaskNotifications from "./TaskNotifications.jsx";
import TaskFormActions from "./TaskFormActions.jsx";

const API_URL = "http://localhost:5000/api/tasks";
const orange = "#fd7e14";

const TaskForm = ({ onTaskAdded }) => {
  // states (parent manages all)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(24);

  const [categories, setCategories] = useState([]); // from backend
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      if (response.data?.success && response.data.data?.length > 0) {
        setCategories(response.data.data);
      } else {
        setCategories([{ _id: "default", name: "General" }]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err.message || err);
      setCategories([{ _id: "default", name: "General" }]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Task title is required";
    else if (title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";

    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";

    if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        notifications: {
          enabled: notificationsEnabled,
          reminderTime: Number(reminderTime) || 0,
        },
      };

      const response = await axios.post(API_URL, taskData);

      // backend may return { success: true, task: ... } or similar
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || "Failed to create task");
      }

      setSuccessMsg(`Task "${taskData.title}" added successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);

      // reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCategory("General");
      setTags("");
      setNotificationsEnabled(true);
      setReminderTime(24);
      setErrors({});

      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error("Add Error:", err.response?.data || err.message || err);
      setErrors({ submit: err.response?.data?.message || err.message || "Failed to add task. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "low":
        return "#28a745";
      case "medium":
        return "#ffc107";
      case "high":
        return "#dc3545";
      case "urgent":
        return "#6f42c1";
      default:
        return "#6c757d";
    }
  };

  const getCategoryColor = (catName) => {
    const colors = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"];
    const hash = (catName || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setCategory("General");
    setTags("");
    setNotificationsEnabled(true);
    setReminderTime(24);
    setErrors({});
    setSuccessMsg("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 task-form card shadow-sm p-4 mb-4 wt-75">
      <h4 className="mb-4 text-center task-form-title" style={{ color: orange }}>
        <FaPlusCircle className="me-2" /> Add a New Task
      </h4>

      {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}
      {errors.submit && <div className="alert alert-danger text-center">{errors.submit}</div>}

      <TaskTitleDescription
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        errors={errors}
        isSubmitting={isSubmitting}
        orange={orange}
      />

      <TaskPriorityDueDate
        priority={priority}
        setPriority={setPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        isSubmitting={isSubmitting}
        getPriorityColor={getPriorityColor}
        orange={orange}
      />

      <TaskCategoryTags
        categories={categories}
        category={category}
        setCategory={setCategory}
        tags={tags}
        setTags={setTags}
        isSubmitting={isSubmitting}
        getCategoryColor={getCategoryColor}
        orange={orange}
      />

      <TaskNotifications
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        reminderTime={reminderTime}
        setReminderTime={setReminderTime}
        isSubmitting={isSubmitting}
        orange={orange}
      />

      <TaskFormActions
        isSubmitting={isSubmitting}
        title={title}
        description={description}
        onClear={handleClear}
      />
    </form>
  );
};

export default TaskForm;
