import React, { useEffect } from "react";
import axios from "axios";
import { FaSave, FaTimes } from "react-icons/fa";

const TaskEditForm = ({
  task,
  API_URL,
  setEditId,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  updateTaskInState, // ✅ اب ہم state میں direct update کریں گے
}) => {
  // ✅ جب form کھلے تو default values set کرو
  useEffect(() => {
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
  }, [task, setEditTitle, setEditDescription]);

  const saveEdit = async () => {
    try {
      const updatedTask = {
        title: editTitle.trim() || task.title,
        description: editDescription.trim() || task.description,
      };

      const res = await axios.put(`${API_URL}/${task._id}`, updatedTask);

      // ✅ صرف وہی task update ہوگا (full fetch کی ضرورت نہیں)
      updateTaskInState(res.data);

      setEditId(null); // واپس normal mode
    } catch (err) {
      console.error("❌ Update Error:", err.message);
    }
  };

  return (
    <div className="card card-body shadow-sm border-0 mb-2">
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
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setEditId(null)}
        >
          <FaTimes className="me-1" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default TaskEditForm;
