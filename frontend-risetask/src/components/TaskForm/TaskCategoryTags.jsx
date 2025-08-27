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
        {/* Category Section */}
        <div className="col-md-6 task-form-group">
          <label className="form-label">Category</label>
          <div className="row g-2">
            {categories.map((cat) => (
              <div key={cat._id} className="col-6 col-md-3">
                <div
                  className={`custom-priority-option ${cat.name === category ? "active" : ""}`}
                  style={{
                    backgroundColor: cat.name === category ? getCategoryColor(cat.name) : "#f8f9fa",
                    color: cat.name === category ? "white" : "#495057",
                    border: `1px solid #b8bec3ff`,
                    textAlign: "center",
                    padding: "12px 20px", // thoda aur roomy padding
                    borderRadius: "50px", // pill style
                    cursor: "pointer",
                    fontSize: "16px", // font size bara
                    fontWeight: "500", // text thoda bold
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setCategory(cat.name)}
                  role="button"
                >
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
          <div className="form-text text-muted">Choose a category for better organization</div>
        </div>

        {/* Tags Section */}
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
