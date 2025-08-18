import express from "express";
import mongoose from "mongoose";
import statsRoutes from "./routes/stats.js";
import homeRoutes from "./routes/homeRoutes.js";
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

app.listen(5000, () => console.log("Server running on port 5000"));
