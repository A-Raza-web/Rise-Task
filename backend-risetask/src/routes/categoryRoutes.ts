// src/routes/categoryRoutes.ts
import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  initializeDefaultCategories,
  updateAllCategoryCounts,
  moveTasksToCategory
} from '../controllers/categoryController';

const router = express.Router();

// Category CRUD operations
router.get('/', getCategories);                           // Get all categories
router.get('/stats', getCategoryStats);                   // Get category statistics
router.get('/:id', getCategoryById);                      // Get single category
router.post('/', createCategory);                         // Create category
router.put('/:id', updateCategory);                       // Update category
router.delete('/:id', deleteCategory);                    // Delete category

// Category management operations
router.post('/initialize-defaults', initializeDefaultCategories); // Initialize default categories
router.put('/update-counts', updateAllCategoryCounts);    // Update all category task counts
router.put('/move-tasks', moveTasksToCategory);           // Move tasks between categories

export default router;