// src/models/taskModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  category: string;
  status: 'pending' | 'in-progress' | 'completed';
  completed: boolean;
  tags: string[];
  notifications: {
    enabled: boolean;
    reminderTime: number; // hours before due date
    sent: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  userId?: mongoose.Types.ObjectId; // for future user authentication
}

const taskSchema = new Schema<ITask>({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Task description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be one of: low, medium, high, urgent'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= new Date();
      },
      message: 'Due date cannot be in the past'
    }
  },
  category: {
    type: String,
    required: [true, 'Task category is required'],
    trim: true,
    default: 'General'
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: 'Status must be one of: pending, in-progress, completed'
    },
    default: 'pending'
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: Number,
      default: 24, // 24 hours before due date
      min: [1, 'Reminder time must be at least 1 hour'],
      max: [168, 'Reminder time cannot exceed 168 hours (1 week)']
    },
    sent: {
      type: Boolean,
      default: false
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User' // for future user authentication
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && !this.completed;
});

// Virtual for days until due
taskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const diffTime = this.dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for priority weight (for sorting)
taskSchema.virtual('priorityWeight').get(function() {
  const weights = { urgent: 4, high: 3, medium: 2, low: 1 };
  return weights[this.priority];
});

// Middleware to sync completed status with task status
taskSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    this.completed = true;
  } else if (this.completed) {
    this.status = 'completed';
  }
  next();
});

// Indexes for better query performance
taskSchema.index({ priority: 1, dueDate: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ completed: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ userId: 1 }); // for future user-specific queries
taskSchema.index({ 'notifications.enabled': 1, dueDate: 1 }); // for notification queries

// Static method to get task statistics
taskSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: ['$completed', 1, 0] } },
        pendingTasks: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        inProgressTasks: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        overdueTasks: { 
          $sum: { 
            $cond: [
              { 
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $eq: ['$completed', false] }
                ]
              }, 
              1, 
              0
            ] 
          } 
        },
        todayTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ['$dueDate', new Date(new Date().setHours(0, 0, 0, 0))] },
                  { $lt: ['$dueDate', new Date(new Date().setHours(23, 59, 59, 999))] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    todayTasks: 0
  };
};

// Static method to get category statistics
taskSchema.statics.getCategoryStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] } }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Static method to get priority statistics
taskSchema.statics.getPriorityStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } }
      }
    },
    {
      $sort: { 
        _id: 1 // This will sort by priority: high, low, medium, urgent alphabetically
      }
    }
  ]);
};

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
