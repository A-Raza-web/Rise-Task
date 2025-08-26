import TaskCategory from "../models/TaskCategory.js";

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await TaskCategory.find(); // MongoDB se saara data le aayega
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// ✅ Add new category (optional agar tum add karna chaho)
export const addCategory = async (req, res) => {
  try {
    const newCategory = new TaskCategory(req.body);
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error adding category", error: error.message });
  }
};
