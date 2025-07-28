/**
 * Database Seeding Script
 * Populates the database with sample data for development and testing
 * 
 * @description This script creates sample tasks, categories, and notifications
 * to help with development and testing of the Rise-Task application.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/taskModel';
import Category from '../models/Category';
import Notification from '../models/Notification';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

/**
 * Sample categories data
 */
const SAMPLE_CATEGORIES = [
  {
    name: 'Work',
    description: 'Work-related tasks and projects',
    color: '#3498db',
    icon: 'briefcase'
  },
  {
    name: 'Personal',
    description: 'Personal tasks and activities',
    color: '#e74c3c',
    icon: 'user'
  },
  {
    name: 'Health',
    description: 'Health and fitness related tasks',
    color: '#2ecc71',
    icon: 'heart'
  },
  {
    name: 'Learning',
    description: 'Educational and skill development tasks',
    color: '#f39c12',
    icon: 'book'
  },
  {
    name: 'Shopping',
    description: 'Shopping lists and purchase tasks',
    color: '#9b59b6',
    icon: 'shopping-cart'
  },
  {
    name: 'Travel',
    description: 'Travel planning and related tasks',
    color: '#1abc9c',
    icon: 'plane'
  }
];

/**
 * Sample tasks data
 */
const SAMPLE_TASKS = [
  {
    title: 'Complete project proposal',
    description: 'Finish writing the Q1 project proposal document with budget estimates and timeline',
    priority: 'high',
    category: 'Work',
    status: 'in-progress',
    tags: ['project', 'proposal', 'deadline'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    notifications: { enabled: true, reminderTime: 24 }
  },
  {
    title: 'Schedule annual health checkup',
    description: 'Call doctor office to schedule yearly physical examination and blood work',
    priority: 'medium',
    category: 'Health',
    status: 'pending',
    tags: ['health', 'appointment', 'annual'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    notifications: { enabled: true, reminderTime: 48 }
  },
  {
    title: 'Learn TypeScript advanced features',
    description: 'Study advanced TypeScript concepts including generics, decorators, and utility types',
    priority: 'medium',
    category: 'Learning',
    status: 'pending',
    tags: ['typescript', 'programming', 'skills'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    notifications: { enabled: true, reminderTime: 24 }
  },
  {
    title: 'Buy groceries for the week',
    description: 'Purchase weekly groceries including vegetables, fruits, dairy, and household items',
    priority: 'low',
    category: 'Shopping',
    status: 'pending',
    tags: ['groceries', 'weekly', 'essentials'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    notifications: { enabled: true, reminderTime: 12 }
  },
  {
    title: 'Plan summer vacation',
    description: 'Research destinations, book flights and accommodation for summer vacation',
    priority: 'low',
    category: 'Travel',
    status: 'pending',
    tags: ['vacation', 'planning', 'summer'],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
    notifications: { enabled: true, reminderTime: 72 }
  },
  {
    title: 'Organize home office',
    description: 'Clean and reorganize home office space, file documents, and update equipment',
    priority: 'low',
    category: 'Personal',
    status: 'pending',
    tags: ['organization', 'office', 'cleaning'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    notifications: { enabled: false }
  },
  {
    title: 'Review quarterly budget',
    description: 'Analyze Q1 expenses and adjust budget for Q2 based on spending patterns',
    priority: 'high',
    category: 'Personal',
    status: 'completed',
    completed: true,
    tags: ['budget', 'finance', 'quarterly'],
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (completed)
    notifications: { enabled: true, reminderTime: 24 }
  },
  {
    title: 'Update resume and LinkedIn profile',
    description: 'Add recent projects and skills to resume and update LinkedIn profile information',
    priority: 'medium',
    category: 'Work',
    status: 'pending',
    tags: ['resume', 'linkedin', 'career'],
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    notifications: { enabled: true, reminderTime: 48 }
  },
  {
    title: 'Start morning exercise routine',
    description: 'Begin daily 30-minute morning exercise routine including cardio and strength training',
    priority: 'high',
    category: 'Health',
    status: 'in-progress',
    tags: ['exercise', 'routine', 'health'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    notifications: { enabled: true, reminderTime: 12 }
  },
  {
    title: 'Read "Clean Code" book',
    description: 'Complete reading "Clean Code" by Robert Martin and take notes on key concepts',
    priority: 'medium',
    category: 'Learning',
    status: 'in-progress',
    tags: ['reading', 'programming', 'best-practices'],
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    notifications: { enabled: true, reminderTime: 24 }
  }
];

/**
 * Connects to the database
 */
async function connectToDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB for seeding');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error as Error);
    throw error;
  }
}

/**
 * Clears existing data from collections
 */
async function clearExistingData(): Promise<void> {
  try {
    await Task.deleteMany({});
    await Category.deleteMany({});
    await Notification.deleteMany({});
    logger.info('Cleared existing data from collections');
  } catch (error) {
    logger.error('Failed to clear existing data', error as Error);
    throw error;
  }
}

/**
 * Seeds categories
 */
async function seedCategories(): Promise<void> {
  try {
    const categories = await Category.insertMany(SAMPLE_CATEGORIES);
    logger.info(`Seeded ${categories.length} categories`);
  } catch (error) {
    logger.error('Failed to seed categories', error as Error);
    throw error;
  }
}

/**
 * Seeds tasks
 */
async function seedTasks(): Promise<void> {
  try {
    const tasks = await Task.insertMany(SAMPLE_TASKS);
    logger.info(`Seeded ${tasks.length} tasks`);

    // Create notifications for tasks with due dates
    let notificationCount = 0;
    for (const task of tasks) {
      if (task.dueDate && task.notifications.enabled && !task.completed) {
        await Notification.createTaskNotifications(task);
        notificationCount++;
      }
    }
    
    logger.info(`Created notifications for ${notificationCount} tasks`);
  } catch (error) {
    logger.error('Failed to seed tasks', error as Error);
    throw error;
  }
}

/**
 * Updates category task counts
 */
async function updateCategoryCounts(): Promise<void> {
  try {
    const categories = await Category.find({});
    for (const category of categories) {
      await category.updateTaskCount();
    }
    logger.info('Updated category task counts');
  } catch (error) {
    logger.error('Failed to update category counts', error as Error);
    throw error;
  }
}

/**
 * Displays seeding summary
 */
async function displaySummary(): Promise<void> {
  try {
    const taskCount = await Task.countDocuments();
    const categoryCount = await Category.countDocuments();
    const notificationCount = await Notification.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = await Task.countDocuments({ completed: false });

    console.log('\n' + '='.repeat(50));
    console.log('🌱 DATABASE SEEDING SUMMARY');
    console.log('='.repeat(50));
    console.log(`📋 Tasks: ${taskCount} total`);
    console.log(`   ✅ Completed: ${completedTasks}`);
    console.log(`   ⏳ Pending: ${pendingTasks}`);
    console.log(`📁 Categories: ${categoryCount}`);
    console.log(`🔔 Notifications: ${notificationCount}`);
    console.log('='.repeat(50));
    console.log('✅ Database seeding completed successfully!');
    console.log('🚀 You can now start the development server');
    console.log('='.repeat(50));
  } catch (error) {
    logger.error('Failed to display summary', error as Error);
  }
}

/**
 * Main seeding function
 */
async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding process...');
    
    await connectToDatabase();
    await clearExistingData();
    await seedCategories();
    await seedTasks();
    await updateCategoryCounts();
    await displaySummary();
    
  } catch (error) {
    logger.error('Database seeding failed', error as Error);
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
}

/**
 * CLI argument parsing
 */
function parseArguments(): { clearOnly: boolean; skipConfirmation: boolean } {
  const args = process.argv.slice(2);
  return {
    clearOnly: args.includes('--clear-only'),
    skipConfirmation: args.includes('--yes') || args.includes('-y')
  };
}

/**
 * Prompts user for confirmation
 */
function promptConfirmation(): Promise<boolean> {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(
      '⚠️  This will clear all existing data and seed with sample data. Continue? (y/N): ',
      (answer: string) => {
        readline.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      }
    );
  });
}

// Run seeding if this file is executed directly
if (require.main === module) {
  (async () => {
    const { clearOnly, skipConfirmation } = parseArguments();
    
    if (!skipConfirmation) {
      const confirmed = await promptConfirmation();
      if (!confirmed) {
        console.log('❌ Seeding cancelled by user');
        process.exit(0);
      }
    }

    if (clearOnly) {
      try {
        await connectToDatabase();
        await clearExistingData();
        console.log('✅ Data cleared successfully');
      } catch (error) {
        console.error('❌ Failed to clear data:', error);
        process.exit(1);
      } finally {
        await mongoose.connection.close();
      }
    } else {
      await seedDatabase();
    }
  })();
}

export { seedDatabase, clearExistingData, SAMPLE_CATEGORIES, SAMPLE_TASKS };