import express from "express";
import TaskController from "../controllers/tasklistController.js"; 

const router = express.Router();

router.get("/", TaskController.getTasks);
router.post("/", TaskController.createTask);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;
