import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  notifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  autoSave: { type: Boolean, default: true },
  language: { type: String, default: "en" },
  timezone: { type: String, default: "UTC" },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  settings: settingsSchema,
});

const User = mongoose.model("User", userSchema);
export default User;
