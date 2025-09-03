import express from "express";
import Category from "../models/TaskCategory.js"

const router = express.Router();

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find(); 
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

export default router;
