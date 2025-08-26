import React from "react";
import { FaExclamationCircle, FaCalendarAlt } from "react-icons/fa";

const TaskPriorityDueDate = ({ priority, setPriority, dueDate, setDueDate, isSubmitting, getPriorityColor, orange }) => {
  return (
    <>
      <h5 className="task-form-section-title" style={{ color: orange }}>
        <FaExclamationCircle className="me-2" /> Schedule & Priority
      </h5>
      <hr />
      <div className="row mb-4">
        <div className="col-md-6 task-form-group slide-in-left">
          <label className="form-label">Priority</label>
          <div className="d-flex flex-wrap gap-2">
            {["low", "medium", "high", "urgent"].map((p) => (
              <div
                key={p}
                className={`custom-priority-option ${p === priority ? "active" : ""}`}
                style={{
                  backgroundColor: p === priority ? getPriorityColor(p) : "white",
                  color: p === priority ? "white" : "#6c757d",
                }}
                onClick={() => setPriority(p)}
                role="button"
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6 task-form-group slide-in-right">
          <label htmlFor="taskDueDate" className="form-label">
            <FaCalendarAlt className="me-2" /> Due Date
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
          <div className="form-text text-muted">Optional deadline for this task</div>
        </div>
      </div>
    </>
  );
};

export default TaskPriorityDueDate;
