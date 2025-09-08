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

    const API_URL = "http://localhost:5000/api/tasklist";

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_URL);
            console.log("📌 API Response:", res.data);

            if (Array.isArray(res.data)) {
                setTasks(res.data);
            } else if (res.data.success) {
                setTasks(res.data.data);
            } else {
                console.error("Failed to fetch tasks:", res.data.message);
                setTasks([]);
            }
        } catch (err) {
            console.error("❌ Load Error:", err.message);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ نیا فنکشن جو براہ راست اسٹیٹ کو اپ ڈیٹ کرے گا
    const updateTaskInState = (updatedTask) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            )
        );
    };

    // ✅ handleDelete فنکشن یہاں شامل ہے
    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/${taskId}`);
            fetchTasks(); // tasks کو دوبارہ لوڈ کریں
        } catch (err) {
            console.error("❌ Delete Error:", err.message);
        }
    };

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
            <TaskFilter />
            <TaskStats tasks={tasks} />
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
                            updateTaskInState={updateTaskInState}
                            API_URL={API_URL}
                            handleDelete={handleDelete}  
                        />
                    ))
                )}
            </div>
            {tasks.length > 0 && <ProgressBar tasks={tasks} />}
        </div>
    );
};

export default TaskList;