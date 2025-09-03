// controllers/dashboardController.js

import Task from '../models/dashboard.js';
import Category from '../models/TaskCategory.js';

class TasksController {
    async getTaskStats(req, res) {
        try {
            // 1. Fetch overview stats from the Task collection
            const totalTasks = await Task.countDocuments();
            const completedTasks = await Task.countDocuments({ status: 'completed' });
            const pendingTasks = await Task.countDocuments({ status: 'pending' });
            const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
            
            // Get today's tasks
            const startOfToday = new Date().setHours(0, 0, 0, 0);
            const todayTasks = await Task.countDocuments({ createdAt: { $gte: startOfToday } });
            
            // 2. Aggregate task counts by category name
            const tasksByCategoryCounts = await Task.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]);

            // 3. Find all categories to get their details (color, icon)
            const allCategories = await Category.find({});

            // 4. Merge the two datasets to create a single array
            const categoriesWithCounts = allCategories.map(category => {
                const taskCount = tasksByCategoryCounts.find(item => item._id === category.name);
                return {
                    name: category.name,
                    color: category.color,
                    icon: category.icon,
                    taskCount: taskCount ? taskCount.count : 0, // Set count to 0 if no tasks are found for that category
                };
            });

            // 5. Send the final response
            res.json({
                success: true,
                data: {
                    overview: {
                        totalTasks,
                        completedTasks,
                        pendingTasks,
                        inProgressTasks,
                        todayTasks,
                        overdueTasks: 0, // Placeholder
                    },
                    categories: categoriesWithCounts,
                    weeklyProgress: [], // Placeholder
                    weeklyLabels: [], // Placeholder
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