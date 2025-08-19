import express from "express";
import Feature from "../models/Feature.js";

const router = express.Router();

// GET all features
router.get("/", async (req, res) => {
  try {
    const features = await Feature.find();
    res.json({ features });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch features" });
  }
});

// POST new feature
router.post("/", async (req, res) => {
  try {
    const { icon, title, description, route } = req.body;

    if (!icon || !title || !description || !route) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newFeature = new Feature({ icon, title, description, route });
    await newFeature.save();

    res.status(201).json({ message: "Feature added", feature: newFeature });
  } catch (err) {
    res.status(500).json({ error: "Failed to add feature" });
  }
});

export default router;
