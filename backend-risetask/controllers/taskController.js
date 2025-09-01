import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags } = req.body;

    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      category,
      tags,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
};


