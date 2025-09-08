import express from "express";
import  protect  from "../middleware/authMiddleware.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", protect, getSettings);

router.put("/", protect, updateSettings);

export default router;
