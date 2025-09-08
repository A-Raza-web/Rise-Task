import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

// ✅ GET user settings
router.get("/:userId", getSettings);

// ✅ UPDATE user settings
router.put("/:userId", updateSettings);

export default router;
