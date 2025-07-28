// src/routes/taskRoutes.ts
import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
  bulkUpdateTasks,
  bulkDeleteTasks,
  // Test error endpoints - FOR DEBUGGING ONLY
  testCustomError,
  testValidationError,
  testCastError,
  testUnhandledRejection,
  testSyncError,
  testDatabaseError,
  testRateLimitError,
  testDuplicateError,
  testJWTError,
  testJWTExpiredError,
  getTestErrorEndpoints
} from '../controllers/taskController';

const router = express.Router();

// Task CRUD operations
router.post('/', createTask);                    // Create task (changed from /create)
router.get('/', getTasks);                       // Get all tasks with filtering/sorting
router.get('/stats', getTaskStats);              // Get task statistics

// Bulk operations (must be before /:id routes)
router.put('/bulk/update', bulkUpdateTasks);     // Bulk update tasks
router.delete('/bulk/delete', bulkDeleteTasks);  // Bulk delete tasks

// ========================================
// TEST ERROR ROUTES - FOR DEBUGGING ONLY
// ========================================
// WARNING: Remove these routes before production deployment!

// Get list of all test error endpoints
router.get('/test-errors', getTestErrorEndpoints);

// Test different types of errors
router.get('/test-errors/custom', testCustomError);
router.post('/test-errors/validation', testValidationError);
router.get('/test-errors/cast', testCastError);
router.get('/test-errors/unhandled-rejection', testUnhandledRejection);
router.get('/test-errors/sync', testSyncError);
router.get('/test-errors/database', testDatabaseError);
router.get('/test-errors/rate-limit', testRateLimitError);
router.post('/test-errors/duplicate', testDuplicateError);
router.get('/test-errors/jwt', testJWTError);
router.get('/test-errors/jwt-expired', testJWTExpiredError);

// Individual task operations (these use :id parameter, so must be last)
router.get('/:id', getTaskById);                 // Get single task
router.put('/:id', updateTask);                  // Update task
router.delete('/:id', deleteTask);               // Delete task
router.patch('/:id/toggle', toggleTaskCompletion); // Toggle task completion

export default router;
