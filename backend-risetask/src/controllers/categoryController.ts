// src/controllers/categoryController.ts
import { Request, Response } from 'express';
import Category from '../models/Category';
import Task from '../models/taskModel';

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = {
      ...req.body,
      isDefault: false // User-created categories are not default
    };

    const newCategory = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Category creation failed',
      error: error.message
    });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Prevent updating default categories' core properties
    if (category.isDefault && (updateData.name || updateData.isDefault !== undefined)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify name or default status of default categories'
      });
    }

    const oldName = category.name;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // If category name changed, update all tasks with this category
    if (updateData.name && oldName !== updateData.name) {
      await Task.updateMany(
        { category: oldName },
        { category: updateData.name }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Category update failed',
      error: error.message
    });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Prevent deletion of default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default categories'
      });
    }

    // Check if category has tasks
    const taskCount = await Task.countDocuments({ category: category.name });
    if (taskCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${taskCount} associated tasks. Please move or delete the tasks first.`
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Category deletion failed',
      error: error.message
    });
  }
};

// Get category statistics
export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const stats = await Task.getCategoryStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category statistics',
      error: error.message
    });
  }
};

// Initialize default categories
export const initializeDefaultCategories = async (req: Request, res: Response) => {
  try {
    await Category.initializeDefaults();
    
    res.status(200).json({
      success: true,
      message: 'Default categories initialized successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize default categories',
      error: error.message
    });
  }
};

// Update task counts for all categories
export const updateAllCategoryCounts = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    
    for (const category of categories) {
      await category.updateTaskCount();
    }

    res.status(200).json({
      success: true,
      message: 'All category task counts updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category counts',
      error: error.message
    });
  }
};

// Move tasks from one category to another
export const moveTasksToCategory = async (req: Request, res: Response) => {
  try {
    const { fromCategory, toCategory } = req.body;

    if (!fromCategory || !toCategory) {
      return res.status(400).json({
        success: false,
        message: 'Both fromCategory and toCategory are required'
      });
    }

    // Check if target category exists
    const targetCategory = await Category.findOne({ name: toCategory });
    if (!targetCategory) {
      return res.status(404).json({
        success: false,
        message: 'Target category not found'
      });
    }

    // Move tasks
    const result = await Task.updateMany(
      { category: fromCategory },
      { category: toCategory }
    );

    // Update category counts
    const fromCat = await Category.findOne({ name: fromCategory });
    if (fromCat) await fromCat.updateTaskCount();
    await targetCategory.updateTaskCount();

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks moved from "${fromCategory}" to "${toCategory}"`,
      data: { movedCount: result.modifiedCount }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to move tasks',
      error: error.message
    });
  }
};