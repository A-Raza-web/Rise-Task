import express from "express";
import Stats from "../models/Stats.js";

const router = express.Router();

// GET /api/stats - MongoDB سے ڈیٹا لینا
router.get("/", async (req, res) => {
  try {
    const stats = await Stats.findOne(); // صرف پہلا document لے رہے ہیں
    if (!stats) {
      return res.status(404).json({ message: "Stats not found" });
    }
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/stats - نیا ڈیٹا add کرنے کے لیے
router.post("/", async (req, res) => {
  try {
    const { tasksCompleted, productivityBoost, happyUsers } = req.body;

    const newStats = new Stats({
      tasksCompleted,
      productivityBoost,
      happyUsers
    });

    await newStats.save();
    res.status(201).json(newStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
