import React from "react";
import axios from "axios";
import { FaSave, FaTimes } from 'react-icons/fa'; 

const TaskEditForm = ({
  task,
  API_URL,
  fetchTasks,
  setEditId,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
}) => {
  const saveEdit = async () => {
    await axios.put(`${API_URL}/${task._id}`, {
      title: editTitle,
      description: editDescription,
    });
    fetchTasks();
    setEditId(null);
  };

  return (
    <>
      <input
        type="text"
        className="form-control mb-2"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        rows="2"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
      />
      <div className="d-flex gap-2">
        <button className="btn btn-success btn-sm" onClick={saveEdit}>
          <FaSave className="me-1" /> Save
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>
          <FaTimes className="me-1" /> Cancel
        </button>
     </div>
    </>
  );
};

export default TaskEditForm;
