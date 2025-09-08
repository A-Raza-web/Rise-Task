import Task from "../models/Tasklist.js";

class TaskController {
    // ✅ Get all tasks
    static async getTasks(req, res) {
        try {
            const tasks = await Task.find();
            res.status(200).json(tasks);
        } catch (error) {
            console.error("❌ Error fetching tasks:", error.message);
            res.status(500).json({ message: "Server error while fetching tasks" });
        }
    }

    // ✅ Create a new task
    static async createTask(req, res) {
        try {
            const { title, description } = req.body;

            const newTask = new Task({ title, description, completed: false }); // default
            await newTask.save();

            res.status(201).json(newTask);
        } catch (error) {
            console.error("❌ Error creating task:", error.message);
            res.status(500).json({ message: "Server error while creating task" });
        }
    }

    // ✅ Update a task
    static async updateTask(req, res) {
        try {
            const { id } = req.params;
            const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedTask) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json(updatedTask);
        } catch (error) {
            console.error("❌ Error updating task:", error.message);
            res.status(500).json({ message: "Server error while updating task" });
        }
    }

    // ✅ Delete a task
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const deletedTask = await Task.findByIdAndDelete(id);

            if (!deletedTask) {
                return res.status(404).json({ message: "Task not found" });
            }

            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("❌ Error deleting task:", error.message);
            res.status(500).json({ message: "Server error while deleting task" });
        }
    }

// ✅ Toggle task complete/incomplete - Fix
static async toggleTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isCompleted = !task.completed;

    let updateData = { completed: isCompleted };

    if (isCompleted) {
      updateData.completedAt = new Date();   // ✅ Save timestamp
    } else {
      updateData.completedAt = undefined;    // ✅ Field remove کر دے گا
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Error toggling task:", error.message);
    res.status(500).json({ message: "Server error while toggling task" });
  }
}

}
export default TaskController;