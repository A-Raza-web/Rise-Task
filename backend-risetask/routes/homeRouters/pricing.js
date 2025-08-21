import express from "express";
import Pricing from "../../models/homeModels/Pricing.js";

const router = express.Router();

// ✅ Get all plans
router.get("/", async (req, res) => {
  try {
    const plans = await Pricing.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new plan
router.post("/", async (req, res) => {
  try {
    const newPlan = new Pricing(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
