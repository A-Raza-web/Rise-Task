import { Router } from "express";
import Home from "../models/Home.js";

const router = Router();

// GET Home page data
router.get("/", async (req, res) => {
  try {
    const homeData = await Home.findOne(); // sirf ek hi document rakhen
    res.json(homeData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home data" });
  }
});

// POST Home page data (sirf ek bar insert karne ke liye)
router.post("/", async (req, res) => {
  try {
    const home = new Home(req.body);
    await home.save();
    res.status(201).json(home);
  } catch (err) {
    res.status(500).json({ error: "Failed to save home data" });
  }
});

export default router;
