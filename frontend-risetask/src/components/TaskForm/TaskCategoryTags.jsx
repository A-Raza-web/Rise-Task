import React from "react";
import { FaTag } from "react-icons/fa";

const TaskCategoryTags = ({ categories, category, setCategory, tags, setTags, isSubmitting, getCategoryColor, orange }) => {
  return (
    <>
      <h5 className="task-form-section-title" style={{ color: orange }}>
        <FaTag className="me-2" /> Organization
      </h5>
      <hr />
      <div className="row mb-4">
        <div className="col-md-6 task-form-group">
          <label className="form-label">Category</label>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`custom-priority-option ${cat.name === category ? "active" : ""}`}
                style={{
                  backgroundColor: cat.name === category ? getCategoryColor(cat.name) : "white",
                  color: cat.name === category ? "white" : "#6c757d",
                  borderColor: cat.name === category ? getCategoryColor(cat.name) : "#ccc",
                }}
                onClick={() => setCategory(cat.name)}
                role="button"
              >
                {cat.name}
              </div>
            ))}
          </div>
          <div className="form-text text-muted">Choose a category for better organization</div>
        </div>

        <div className="col-md-6 task-form-group">
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
    </>
  );
};

export default TaskCategoryTags;

