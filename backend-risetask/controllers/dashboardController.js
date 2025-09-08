// controllers/dashboardController.js

import Task from '../models/dashboard.js';
import Category from '../models/TaskCategory.js';

class TasksController {
    async getTaskStats(req, res) {
        try {
            // ... (your existing overview stats code) ...

            const totalTasks = await Task.countDocuments();
            const completedTasks = await Task.countDocuments({ completed: true });
            const pendingTasks = await Task.countDocuments({ completed: false });
            const inProgressTasks = 0; 
            const startOfToday = new Date().setHours(0, 0, 0, 0);
            const todayTasks = await Task.countDocuments({ createdAt: { $gte: startOfToday } });
            const today = new Date();
            const overdueTasks = await Task.countDocuments({
                dueDate: { $lt: today },
                completed: false 
            });

            // Aggregate task counts by category name
            const tasksByCategoryCounts = await Task.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]);

            const allCategories = await Category.find({});
            const categoriesWithCounts = allCategories.map(category => {
                const taskCount = tasksByCategoryCounts.find(item => item._id === category.name);
                return {
                    name: category.name,
                    color: category.color,
                    icon: category.icon,
                    taskCount: taskCount ? taskCount.count : 0,
                };
            });
            
            // Weekly Progress Logic: Aggregate completed tasks from the last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const weeklyProgress = await Task.aggregate([
                {
                    $match: {
                        completed: true, // Use the correct field 'completed'
                        // Make sure your completedAt field is set when a task is completed.
                        completedAt: { $exists: true, $gte: sevenDaysAgo } 
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: '$completedAt' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const weeklyData = daysOfWeek.map((day, index) => {
                const dayData = weeklyProgress.find(item => item._id === index + 1);
                return dayData ? dayData.count : 0;
            });

            // Send the final response
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
                    weeklyLabels: daysOfWeek
                }
            });

        } catch (error) {
            console.error('Failed to fetch dashboard statistics:', error);
            res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics." });
        }
    }
}

const tasksController = new TasksController();
export default tasksController;