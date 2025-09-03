// routes/tasksRoute.js
import express from 'express';
import tasksController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', (req, res) => tasksController.getTaskStats(req, res));

export default router;