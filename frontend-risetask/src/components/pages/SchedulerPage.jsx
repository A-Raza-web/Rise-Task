// src/pages/SchedulerPage.jsx
import React, { useState } from 'react';
import { FaPencilAlt, FaCalendarAlt, FaStar, FaSave } from 'react-icons/fa';
import './SchedulerPage.css';

const SchedulerPage = () => {
  // useState hook کا استعمال کر کے priority state کو manage کیا گیا ہے
  const [priority, setPriority] = useState('medium'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Task Scheduled!");
    // یہاں پر آپ فارم کا ڈیٹا، بشمول priority کی ویلیو، بھیج سکتے ہیں
    console.log("Priority selected:", priority);
  };

  return (
    <div className="scheduler-page-container animated-page">
      <div className="scheduler-page-content">
        {/* Header with Icon */}
        <div className="text-center mb-5 scheduler-header">
          <div className="scheduler-icon-circle mb-3 slide-in-top" style={{ animationDelay: '0.2s' }}>
            <FaCalendarAlt />
          </div>
          <h3 className="fw-bold display-6 slide-in-bottom" style={{ animationDelay: '0.4s' }}>
            Smart Scheduler
          </h3>
          <p className="text-muted lead fade-in" style={{ animationDelay: '0.6s' }}>
            Plan your tasks intelligently with priority and deadlines.
          </p>
        </div>

        {/* Form */}
        <form className="scheduler-form-card pop-in" style={{ animationDelay: '0.8s' }} onSubmit={handleSubmit}>
          {/* Task Name */}
          <div className="mb-3 slide-in-left" style={{ animationDelay: '1s' }}>
            <label htmlFor="taskName" className="form-label scheduler-label">
              <FaPencilAlt className="me-2" /> Task Name
            </label>
            <input
              type="text"
              className="form-control scheduler-input"
              id="taskName"
              placeholder="e.g. Write blog post"
              required
            />
          </div>

          {/* Deadline */}
          <div className="mb-3 slide-in-left" style={{ animationDelay: '1.2s' }}>
            <label htmlFor="deadline" className="form-label scheduler-label">
              <FaCalendarAlt className="me-2" /> Deadline
            </label>
            <input type="date" className="form-control scheduler-input" id="deadline" required />
          </div>

          {/* Priority */}
          <div className="mb-3 slide-in-left" style={{ animationDelay: '1.4s' }}>
            <label htmlFor="priority" className="form-label scheduler-label">
              <FaStar className="me-2" /> Priority
            </label>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <div
                className={`custom-priority-option low ${priority === 'low' ? 'active' : ''}`}
                onClick={() => setPriority('low')}
                data-priority="low"
              >
                Low
              </div>
              <div
                className={`custom-priority-option medium ${priority === 'medium' ? 'active' : ''}`}
                onClick={() => setPriority('medium')}
                data-priority="medium"
              >
                Medium
              </div>
              <div
                className={`custom-priority-option high ${priority === 'high' ? 'active' : ''}`}
                onClick={() => setPriority('high')}
                data-priority="high"
              >
                High
              </div>
              <div
                className={`custom-priority-option urgent ${priority === 'urgent' ? 'active' : ''}`}
                onClick={() => setPriority('urgent')}
                data-priority="urgent"
              >
                Urgent
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-grid mt-4 fade-in" style={{ animationDelay: '1.6s' }}>
            <button
              type="submit"
              className="btn text-white scheduler-submit-btn"
            >
              <FaSave className="me-2" /> Schedule Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulerPage;