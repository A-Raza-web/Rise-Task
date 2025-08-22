import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import heroRoutes from "./routes/homeRouters/heroRoutes.js";
import featuresRoute from "./routes/homeRouters/featuresRoutes.js";
import aboutRoutes from "./routes/homeRouters/aboutRoutes.js";
import testimonialRoutes from "./routes/homeRouters/testimonialRoutes.js";
import pricingRoutes from "./routes/homeRouters/pricing.js";
import footerRoutes from "./routes/homeRouters/footerRoutes.js";
import authForm from "./routes/auth.js"

// ✅ .env load
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/features", featuresRoute);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api",authForm)

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
