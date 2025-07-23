// src/pages/SchedulerPage.jsx
import React from 'react';
import { FaPencilAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';

const SchedulerPage = () => {
  return (
    <div className="container mt-5">
      <div
  className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
  style={{
    width: '48px',
    height: '48px',
    backgroundColor: '#ff5c00',
  }}
>
  <FaCalendarAlt style={{ color: '#fff', fontSize: '1.5rem' }} />
</div>


        <form>
          {/* Task Name */}
          <div className="mb-3">
            <label htmlFor="taskName" className="form-label">
              <FaPencilAlt className="me-2" /> Task Name
            </label>
            <input type="text" className="form-control" id="taskName" placeholder="e.g. Write blog post" />
          </div>

          {/* Deadline */}
          <div className="mb-3">
            <label htmlFor="deadline" className="form-label">
              <FaCalendarAlt className="me-2" /> Deadline
            </label>
            <input type="date" className="form-control" id="deadline" />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              <FaStar className="me-2" /> Priority
            </label>
            <select className="form-select" id="priority">
              <option value="" disabled selected>Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button type="submit" className="btn btn-orange-filled">Schedule Task</button>
          </div>
        </form>
      </div>
  );
};

export default SchedulerPage;
