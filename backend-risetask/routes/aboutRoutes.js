// routes/aboutRoutes.js
import express from "express";
import About from "../models/About.js";

const router = express.Router();

// GET - get about data
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne(); // ek hi about section hai
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch About data" });
  }
});

// POST - create about data
router.post("/", async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - update about data
router.put("/:id", async (req, res) => {
  try {
    const updated = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
