// src/controllers/taskController.ts
import { Request, Response } from 'express';
import Task from '../models/taskModel';
import Category from '../models/Category';
import Notification from '../models/Notification';
import { AppError, catchAsync } from '../middleware/errorHandler';

// Interface for query parameters
interface TaskQuery {
  priority?: string;
  category?: string;
  status?: string;
  completed?: boolean;
  dueDate?: any;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const taskData = {
      ...req.body,
      // Ensure category exists or use default
      category: req.body.category || 'General'
    };

    const newTask = await Task.create(taskData);
    
    // Create notifications for the task if due date is set
    if (newTask.dueDate && newTask.notifications.enabled) {
      await Notification.createTaskNotifications(newTask);
    }

    // Update category task count
    const category = await Category.findOne({ name: newTask.category });
    if (category) {
      await category.updateTaskCount();
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false,
      message: 'Task creation failed', 
      error: error.message 
    });
  }
};

// Get all tasks with filtering, sorting, and pagination
export const getTasks = async (req: Request, res: Response) => {
  try {
    const {
      priority,
      category,
      status,
      completed,
      dueDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    }: TaskQuery = req.query;

    // Build filter object
    const filter: any = {};

    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (completed !== undefined) filter.completed = completed === true || completed === 'true';

    // Handle due date filtering
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dueDate) {
        case 'today':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          filter.dueDate = { $gte: today, $lt: tomorrow };
          break;
        case 'overdue':
          filter.dueDate = { $lt: today };
          filter.completed = false;
          break;
        case 'upcoming':
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          filter.dueDate = { $gte: today, $lte: nextWeek };
          break;
        case 'this_week':
          const endOfWeek = new Date(today);
          endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));
          filter.dueDate = { $gte: today, $lte: endOfWeek };
          break;
      }
    }

    // Handle search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort: any = {};
    if (sortBy === 'priority') {
      // Custom priority sorting: urgent > high > medium > low
      sort.priorityWeight = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'dueDate') {
      sort.dueDate = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / Number(limit));

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalTasks,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Fetching tasks failed', 
      error: error.message 
    });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Store old category for count update
    const oldCategory = task.category;

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update category task counts if category changed
    if (oldCategory !== updatedTask!.category) {
      const oldCat = await Category.findOne({ name: oldCategory });
      const newCat = await Category.findOne({ name: updatedTask!.category });
      
      if (oldCat) await oldCat.updateTaskCount();
      if (newCat) await newCat.updateTaskCount();
    }

    // Handle notification updates if due date or notification settings changed
    if (updateData.dueDate !== undefined || updateData.notifications !== undefined) {
      // Remove old notifications
      await Notification.deleteMany({ taskId: id, sent: false });
      
      // Create new notifications if needed
      if (updatedTask!.dueDate && updatedTask!.notifications.enabled) {
        await Notification.createTaskNotifications(updatedTask);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Task update failed',
      error: error.message
    });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Store category for count update
    const category = task.category;

    // Delete the task
    await Task.findByIdAndDelete(id);

    // Delete associated notifications
    await Notification.deleteMany({ taskId: id });

    // Update category task count
    const cat = await Category.findOne({ name: category });
    if (cat) {
      await cat.updateTaskCount();
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Task deletion failed',
      error: error.message
    });
  }
};

// Toggle task completion status
export const toggleTaskCompletion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Toggle completion status
    task.completed = !task.completed;
    task.status = task.completed ? 'completed' : 'pending';
    
    await task.save();

    // Create completion notification if task was completed
    if (task.completed) {
      await Notification.create({
        taskId: task._id,
        type: 'completed',
        title: `Task Completed: ${task.title}`,
        message: `Congratulations! You've completed "${task.title}".`,
        priority: 'low',
        sent: true,
        sentAt: new Date(),
        userId: task.userId
      });
    }

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
      data: task
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle task completion',
      error: error.message
    });
  }
};

// Get task statistics
export const getTaskStats = async (req: Request, res: Response) => {
  try {
    // Basic stats aggregation since the model methods don't exist
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = await Task.countDocuments({ completed: false });
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      completed: false
    });

    const categoryStats = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priorityStats = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          overdue: overdueTasks
        },
        categories: categoryStats,
        priorities: priorityStats
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task statistics',
      error: error.message
    });
  }
};

// Bulk operations
export const bulkUpdateTasks = async (req: Request, res: Response) => {
  try {
    const { taskIds, updateData } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs array is required'
      });
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds } },
      updateData,
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks updated successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Bulk update failed',
      error: error.message
    });
  }
};

// Bulk delete tasks
export const bulkDeleteTasks = async (req: Request, res: Response) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs array is required'
      });
    }

    // Get tasks to update category counts
    const tasks = await Task.find({ _id: { $in: taskIds } });
    const categories = [...new Set(tasks.map(task => task.category))];

    // Delete tasks and notifications
    const result = await Task.deleteMany({ _id: { $in: taskIds } });
    await Notification.deleteMany({ taskId: { $in: taskIds } });

    // Update category counts
    for (const categoryName of categories) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        await category.updateTaskCount();
      }
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} tasks deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Bulk delete failed',
      error: error.message
    });
  }
};

// ========================================
// TEST ERROR ENDPOINTS - FOR DEBUGGING ONLY
// ========================================
// NOTE: Remove these endpoints before production deployment

// Test 1: Custom AppError with specific status code
export const testCustomError = catchAsync(async (req: Request, res: Response) => {
  throw new AppError('This is a test custom error for debugging purposes', 422);
});

// Test 2: Database validation error
export const testValidationError = catchAsync(async (req: Request, res: Response) => {
  // Try to create a task with invalid data to trigger validation error
  await Task.create({
    title: '', // Empty title should trigger validation error
    priority: 'invalid_priority', // Invalid priority
    dueDate: 'invalid_date' // Invalid date format
  });
  
  res.status(200).json({
    success: true,
    message: 'This should not be reached due to validation error'
  });
});

// Test 3: Database cast error (invalid ObjectId)
export const testCastError = catchAsync(async (req: Request, res: Response) => {
  // Try to find a task with invalid ObjectId format
  const task = await Task.findById('invalid_object_id_format');
  
  res.status(200).json({
    success: true,
    data: task
  });
});

// Test 4: Unhandled promise rejection
export const testUnhandledRejection = async (req: Request, res: Response) => {
  // This will cause an unhandled promise rejection
  setTimeout(() => {
    throw new Error('Test unhandled promise rejection');
  }, 100);
  
  res.status(200).json({
    success: true,
    message: 'Unhandled rejection test initiated'
  });
};

// Test 5: Synchronous error (uncaught exception)
export const testSyncError = (req: Request, res: Response) => {
  // This will throw a synchronous error
  throw new Error('Test synchronous error - should be caught by global error handler');
};

// Test 6: Database connection error simulation
export const testDatabaseError = catchAsync(async (req: Request, res: Response) => {
  // Try to perform an operation that might fail due to database issues
  const result = await Task.collection.stats(); // This might fail if DB is disconnected
  
  res.status(200).json({
    success: true,
    message: 'Database connection test passed',
    data: result
  });
});

// Test 7: Rate limiting simulation (429 error)
export const testRateLimitError = (req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    message: 'Rate limit exceeded - test error',
    retryAfter: 60
  });
};

// Test 8: Duplicate key error simulation
export const testDuplicateError = catchAsync(async (req: Request, res: Response) => {
  // Try to create duplicate tasks with same unique field (if any)
  const taskData = {
    title: 'Duplicate Test Task',
    description: 'Testing duplicate key error',
    priority: 'medium',
    category: 'General'
  };
  
  // Create first task
  await Task.create(taskData);
  
  // Try to create duplicate (this might not trigger duplicate error unless you have unique constraints)
  // For demonstration, we'll simulate the error
  const duplicateError = new Error('E11000 duplicate key error collection');
  (duplicateError as any).code = 11000;
  (duplicateError as any).errmsg = 'duplicate key error collection: test.tasks index: title_1 dup key: { title: "Duplicate Test Task" }';
  
  throw duplicateError;
});

// Test 9: JSON Web Token error simulation
export const testJWTError = (req: Request, res: Response) => {
  const jwtError = new Error('invalid signature');
  (jwtError as any).name = 'JsonWebTokenError';
  throw jwtError;
};

// Test 10: Token expired error simulation
export const testJWTExpiredError = (req: Request, res: Response) => {
  const expiredError = new Error('jwt expired');
  (expiredError as any).name = 'TokenExpiredError';
  throw expiredError;
};

// Test endpoint to get all available test errors
export const getTestErrorEndpoints = (req: Request, res: Response) => {
  const testEndpoints = [
    {
      endpoint: '/api/tasks/test-errors/custom',
      method: 'GET',
      description: 'Test custom AppError with 422 status code',
      expectedError: 'Custom error with specific status code'
    },
    {
      endpoint: '/api/tasks/test-errors/validation',
      method: 'POST',
      description: 'Test MongoDB validation error',
      expectedError: 'Validation error for invalid task data'
    },
    {
      endpoint: '/api/tasks/test-errors/cast',
      method: 'GET',
      description: 'Test MongoDB cast error (invalid ObjectId)',
      expectedError: 'Cast error for invalid ObjectId format'
    },
    {
      endpoint: '/api/tasks/test-errors/unhandled-rejection',
      method: 'GET',
      description: 'Test unhandled promise rejection',
      expectedError: 'Unhandled promise rejection (check server logs)'
    },
    {
      endpoint: '/api/tasks/test-errors/sync',
      method: 'GET',
      description: 'Test synchronous error',
      expectedError: 'Synchronous error caught by global handler'
    },
    {
      endpoint: '/api/tasks/test-errors/database',
      method: 'GET',
      description: 'Test database connection error',
      expectedError: 'Database operation error (if DB is disconnected)'
    },
    {
      endpoint: '/api/tasks/test-errors/rate-limit',
      method: 'GET',
      description: 'Test rate limiting error (429)',
      expectedError: 'Rate limit exceeded error'
    },
    {
      endpoint: '/api/tasks/test-errors/duplicate',
      method: 'POST',
      description: 'Test duplicate key error',
      expectedError: 'Duplicate key error simulation'
    },
    {
      endpoint: '/api/tasks/test-errors/jwt',
      method: 'GET',
      description: 'Test JWT invalid signature error',
      expectedError: 'Invalid JWT token error'
    },
    {
      endpoint: '/api/tasks/test-errors/jwt-expired',
      method: 'GET',
      description: 'Test JWT expired error',
      expectedError: 'Expired JWT token error'
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Available test error endpoints for debugging',
    warning: 'These endpoints are for testing error handling only. Remove before production!',
    data: testEndpoints
  });
};
