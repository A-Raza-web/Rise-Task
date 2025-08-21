import express from "express";
import Footer from "../../models/homeModels/Footer.js";

const router = express.Router();

// Get Footer Data
router.get("/", async (req, res) => {
  try {
    const footer = await Footer.findOne(); // sirf ek hi footer hoga
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch footer data" });
  }
});

// Post Footer Data (Postman ke liye)
router.post("/", async (req, res) => {
  try {
    const newFooter = new Footer(req.body);
    await newFooter.save();
    res.json(newFooter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
