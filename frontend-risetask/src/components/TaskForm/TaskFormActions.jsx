import React from "react";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const TaskFormActions = ({ isSubmitting, title, description, onClear }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4 fade-in">
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
          onClick={onClear}
          disabled={isSubmitting}
        >
          <FaTrashAlt className="me-2" /> Clear Form
        </button>
      )}
    </div>
  );
};

export default TaskFormActions;

