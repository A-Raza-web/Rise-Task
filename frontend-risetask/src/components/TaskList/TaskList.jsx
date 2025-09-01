import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrophy } from "react-icons/fa"; 
import TaskFilter from "./TaskFilter";
import TaskStats from "./TaskStats";
import TaskItem from "./TaskItem";
import ProgressBar from "./ProgressBar";
import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Backend ka port check karein (Express default 5000 hota hai, aapne 3000 likha tha)
  const API_URL = "http://localhost:5000/api/tasklist";

  // ✅ Sirf saare tasks fetch karne ka function
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      console.log("📌 API Response:", res.data);

      // Agar API direct array bhej rahi hai
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (res.data.success) {
        setTasks(res.data.data);
      } else {
        console.error("Failed to fetch tasks:", res.data.message);
        setTasks([]); // Set tasks to an empty array on failure
      }
    } catch (err) {
      console.error("❌ Load Error:", err.message);
      setTasks([]); // Set tasks to an empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Mount hone par tasks fetch karo
  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="pt-5 container-fluid">
      {/* Task Filters (optional component) */}
      <TaskFilter />

      {/* Task Stats */}
      <TaskStats tasks={tasks} />

      {/* Main Task List Grid */}
      <div className="row g-2 g-md-3">
        {tasks.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FaTrophy className="display-3 text-muted mb-3" />
            <h5 className="text-muted">No tasks yet!</h5>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              editId={editId}
              setEditId={setEditId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              fetchTasks={fetchTasks}
              API_URL={API_URL}
            />
          ))
        )}
      </div>
      
      {/* Progress Bar */}
      {tasks.length > 0 && <ProgressBar tasks={tasks} />}
    </div>
  );
};

export default TaskList;