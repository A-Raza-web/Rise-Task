import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String },
  icon: { type: String },
  isDefault: { type: Boolean, default: false },
  taskCount: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
