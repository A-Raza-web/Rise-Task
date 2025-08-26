import React from "react";
import { FaTasks, FaStickyNote } from "react-icons/fa";

const TaskTitleDescription = ({ title, setTitle, description, setDescription, errors, isSubmitting, orange }) => {
  return (
    <div className="row mb-4">
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
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        <div className="form-text">{description.length}/500 characters</div>
      </div>
    </div>
  );
};

export default TaskTitleDescription;
