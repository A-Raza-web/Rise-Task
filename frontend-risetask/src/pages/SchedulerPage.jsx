// src/pages/SchedulerPage.jsx
import React, { useEffect } from 'react';
import { FaPencilAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SchedulerPage = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
      }}
    >
      <div className="w-100" style={{ maxWidth: '600px' }} data-aos="fade-up">
        {/* Header with Icon */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#fd7e14',
            }}
          >
            <FaCalendarAlt style={{ color: '#fff', fontSize: '1.8rem' }} />
          </div>
          <h3 className="fw-bold" style={{ color: '#fd7e14' }}>
            Smart Scheduler
          </h3>
          <p className="text-muted">
            Plan your tasks intelligently with priority and deadlines
          </p>
        </div>

        {/* Form */}
        <form className="bg-white p-4 shadow rounded">
          {/* Task Name */}
          <div className="mb-3">
            <label htmlFor="taskName" className="form-label fw-semibold">
              <FaPencilAlt className="me-2 text-warning" /> Task Name
            </label>
            <input
              type="text"
              className="form-control"
              id="taskName"
              placeholder="e.g. Write blog post"
              required
            />
          </div>

          {/* Deadline */}
          <div className="mb-3">
            <label htmlFor="deadline" className="form-label fw-semibold">
              <FaCalendarAlt className="me-2 text-warning" /> Deadline
            </label>
            <input type="date" className="form-control" id="deadline" required />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label htmlFor="priority" className="form-label fw-semibold">
              <FaStar className="me-2 text-warning" /> Priority
            </label>
            <select className="form-select" id="priority" required>
              <option value="" disabled selected>
                Select Priority
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center mt-4">
            <button
              type="submit"
              className="btn text-white px-4 py-2"
              style={{ backgroundColor: '#fd7e14' }}
            >
              Schedule Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulerPage;
