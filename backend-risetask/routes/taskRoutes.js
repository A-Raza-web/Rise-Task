import express from "express";
import { createTask, getTasks } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);   // Create Task
router.get("/", getTasks);      // Get All Tasks

export default router;
