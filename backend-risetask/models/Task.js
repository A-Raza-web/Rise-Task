import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  dueDate: { type: Date },
  category: { type: String, default: "General" },
  tags: [String],
  notifications: {
    enabled: { type: Boolean, default: true },
    reminderTime: { type: Number, default: 24 },
  },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;   // yeh line important hai
