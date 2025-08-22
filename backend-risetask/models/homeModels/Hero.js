// models/Home.js
import mongoose from "mongoose";

// 🔹 Features Schema
const FeatureSchema = new mongoose.Schema({
  icon: { type: String, required: true },       // e.g. "FaRegEdit"
  title: { type: String, required: true },      // e.g. "Create Tasks"
  description: { type: String, required: true }, // e.g. "Easily create and organize your daily tasks..."
  route: { type: String, required: true }       // e.g. "/create-task"
});

// 🔹 Main Home Schema
const HomeSchema = new mongoose.Schema({
  heroBg: { type: String, required: true },  // Background image path
  heading: { type: String, required: true },
  subtext: { type: String, required: true },

  stats: {
    tasksCompleted: { type: Number, default: 0 },
    productivityBoost: { type: Number, default: 0 },
    happyUsers: { type: Number, default: 0 },
  },

  buttons: [
    {
      text: { type: String, required: true },
      link: { type: String, required: true },
      type: { type: String, enum: ["outlined", "filled"], default: "outlined" },
    },
  ],

  features: [FeatureSchema], // 🔹 Merge: Features added here
});

export default mongoose.model("Home", HomeSchema);
