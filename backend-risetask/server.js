import express from "express";
import mongoose from "mongoose";
import statsRoutes from "./routes/stats.js";
import homeRoutes from "./routes/homeRouters/homeRoutes.js";
import featuresRoute from "./routes/homeRouters/featuresRoutes.js";
import aboutRoutes from "./routes/homeRouters/aboutRoutes.js";
import testimonialRoutes from "./routes/homeRouters/testimonialRoutes.js";
import pricingRoutes from "./routes/homeRouters/pricing.js";
import footerRoutes from "./routes/homeRouters/footerRoutes.js";

import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://localhost:27017/riseTask", {
 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

// Routes
app.use("/api/stats", statsRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/features", featuresRoute);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/footer", footerRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
