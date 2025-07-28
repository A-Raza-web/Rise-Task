// src/scripts/migrateData.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/taskModel';
import Category from '../models/Category';

dotenv.config();

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB for data migration');

    // Initialize default categories first
    await Category.initializeDefaults();
    console.log('✅ Default categories initialized');

    // Find all tasks that need migration (missing new fields)
    const tasksToMigrate = await Task.find({
      $or: [
        { priority: { $exists: false } },
        { category: { $exists: false } },
        { status: { $exists: false } },
        { tags: { $exists: false } },
        { notifications: { $exists: false } }
      ]
    });

    console.log(`Found ${tasksToMigrate.length} tasks that need migration`);

    if (tasksToMigrate.length === 0) {
      console.log('✅ No tasks need migration');
      return;
    }

    // Migrate each task
    let migratedCount = 0;
    for (const task of tasksToMigrate) {
      try {
        const updateData: any = {};

        // Set default priority if missing
        if (!task.priority) {
          updateData.priority = 'medium';
        }

        // Set default category if missing
        if (!task.category) {
          updateData.category = 'General';
        }

        // Set default status based on completed field
        if (!task.status) {
          updateData.status = task.completed ? 'completed' : 'pending';
        }

        // Set default tags if missing
        if (!task.tags) {
          updateData.tags = [];
        }

        // Set default notifications if missing
        if (!task.notifications) {
          updateData.notifications = {
            enabled: true,
            reminderTime: 24,
            sent: false
          };
        }

        // Update the task
        await Task.findByIdAndUpdate(task._id, updateData);
        migratedCount++;

        console.log(`✅ Migrated task: ${task.title}`);
      } catch (error) {
        console.error(`❌ Failed to migrate task ${task._id}:`, error);
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Migration Summary:`);
    console.log(`   - Total tasks found: ${tasksToMigrate.length}`);
    console.log(`   - Successfully migrated: ${migratedCount}`);
    console.log(`   - Failed migrations: ${tasksToMigrate.length - migratedCount}`);

    // Update category task counts
    console.log('\n📈 Updating category task counts...');
    const categories = await Category.find();
    for (const category of categories) {
      await category.updateTaskCount();
    }
    console.log('✅ Category task counts updated');

    // Display final statistics
    const totalTasks = await Task.countDocuments();
    const tasksByPriority = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const tasksByCategory = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log(`\n📊 Final Statistics:`);
    console.log(`   - Total tasks: ${totalTasks}`);
    console.log(`   - Tasks by priority:`, tasksByPriority);
    console.log(`   - Tasks by category:`, tasksByCategory);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export default migrateData;