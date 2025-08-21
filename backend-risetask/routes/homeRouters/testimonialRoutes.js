// routes/testimonialRoutes.js
import express from "express";
import Testimonial from "../../models/homeModels/Testimonial.js";

const router = express.Router();

// ✅ Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error });
  }
});

// ✅ Add a testimonial
router.post("/", async (req, res) => {
  try {
    const { name, role, message, image, rating } = req.body;
    const newTestimonial = new Testimonial({ name, role, message, image, rating });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Error saving testimonial", error });
  }
});

export default router;
