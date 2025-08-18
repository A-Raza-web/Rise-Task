import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  tasksCompleted: { type: Number, required: true },
  productivityBoost: { type: Number, required: true },
  happyUsers: { type: Number, required: true }
});

export default mongoose.model("Stats", statsSchema);
