// controllers/dashboardController.js

import Task from '../models/dashboard.js';
import Category from '../models/TaskCategory.js';


class TasksController {
  async getTaskStats(req, res) {
    try {
      // 🔹 Overview Counts
      const totalTasks = await Task.countDocuments();
      const completedTasks = await Task.countDocuments({ completed: true });
      const pendingTasks = await Task.countDocuments({ completed: false });

      // 🔹 Example: tasks marked as "in-progress" (if you use status field)
      const inProgressTasks = await Task.countDocuments({ status: "in-progress" }).catch(() => 0);

      // 🔹 Tasks created today
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayTasks = await Task.countDocuments({ createdAt: { $gte: startOfToday } });

      // 🔹 Overdue Tasks
      const today = new Date();
      const overdueTasks = await Task.countDocuments({
        dueDate: { $lt: today },
        completed: false,
      });

      // 🔹 Aggregate tasks by category
      const tasksByCategoryCounts = await Task.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      const allCategories = await Category.find({});
      const categoriesWithCounts = allCategories.map((category) => {
        const taskCount = tasksByCategoryCounts.find((item) => item._id === category.name);
        return {
          name: category.name,
          color: category.color,
          icon: category.icon,
          taskCount: taskCount ? taskCount.count : 0,
        };
      });

      // 🔹 Weekly Progress (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const weeklyProgress = await Task.aggregate([
        {
          $match: {
            completed: true,
            completedAt: { $exists: true, $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: '$completedAt' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // 🔹 Map data to days of week
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyData = daysOfWeek.map((day, index) => {
        const dayData = weeklyProgress.find((item) => item._id === index + 1);
        return {
          day,
          count: dayData ? dayData.count : 0,
        };
      });

      // 🔹 Final Response
      res.json({
        success: true,
        data: {
          overview: {
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            todayTasks,
            overdueTasks,
          },
          categories: categoriesWithCounts,
          weeklyProgress: weeklyData,
        },
      });
    } catch (error) {
      console.error('❌ Failed to fetch dashboard statistics:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch dashboard statistics.' });
    }
  }
}

const tasksController = new TasksController();
export default tasksController;
