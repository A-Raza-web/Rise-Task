import express from "express";
import Category from "../models/TaskCategory.js"; // اپنے model کا path درست رکھو
const router = express.Router();

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;
