import React from "react";
import { FaBell } from "react-icons/fa";

const TaskNotifications = ({ notificationsEnabled, setNotificationsEnabled, reminderTime, setReminderTime, isSubmitting, orange }) => {
  return (
    <>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TaskNotifications;
