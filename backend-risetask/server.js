import express from "express";
import mongoose from "mongoose";
import statsRoutes from "./routes/stats.js";
import homeRoutes from "./routes/homeRoutes.js";
import featuresRoute from "./routes/featuresRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";

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

app.listen(5000, () => console.log("Server running on port 5000"));
