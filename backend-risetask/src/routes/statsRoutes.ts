import express from 'express';
import StatsModel from '../models/Stats';

const router = express.Router();

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await StatsModel.findOne(); // Assuming only 1 document
    if (!stats) {
      return res.status(404).json({ message: 'No stats found' });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
