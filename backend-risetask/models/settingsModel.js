import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  darkMode: { type: Boolean, default: false },
  notifications: { type: Boolean, default: true },
  autoSave: { type: Boolean, default: true },
  language: { type: String, default: "en" },
  timezone: { type: String, default: "UTC" }
}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
