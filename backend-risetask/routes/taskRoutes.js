import express from "express";
import {createTask} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);   // Create Task


export default router;
