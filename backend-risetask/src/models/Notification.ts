// src/models/Notification.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
  taskId: mongoose.Types.ObjectId;
  type: 'due_soon' | 'overdue' | 'completed' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  sent: boolean;
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: mongoose.Types.ObjectId; // for future user authentication
}

export interface INotificationModel extends Model<INotification> {
  createTaskNotifications(task: any): Promise<void>;
  getPendingNotifications(): Promise<INotification[]>;
  markAsSent(notificationIds: string[]): Promise<void>;
  getUserNotifications(userId?: string, limit?: number): Promise<INotification[]>;
  markAsRead(notificationIds: string[]): Promise<void>;
  cleanupOldNotifications(daysOld?: number): Promise<void>;
}

const notificationSchema = new Schema<INotification>({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required']
  },
  type: {
    type: String,
    enum: {
      values: ['due_soon', 'overdue', 'completed', 'reminder'],
      message: 'Type must be one of: due_soon, overdue, completed, reminder'
    },
    required: [true, 'Notification type is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [300, 'Message cannot exceed 300 characters']
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be one of: low, medium, high, urgent'
    },
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  sent: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date
  },
  sentAt: {
    type: Date
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

// Indexes for better query performance
notificationSchema.index({ taskId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ sent: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ userId: 1 });
notificationSchema.index({ createdAt: -1 });

// Virtual for checking if notification is due
notificationSchema.virtual('isDue').get(function() {
  return this.scheduledFor && this.scheduledFor <= new Date() && !this.sent;
});

// Static method to create task notifications
notificationSchema.statics.createTaskNotifications = async function(this: INotificationModel, task: any) {
  const notifications = [];
  
  if (task.dueDate && task.notifications.enabled) {
    // Due soon notification
    const dueSoonTime = new Date(task.dueDate.getTime() - (task.notifications.reminderTime * 60 * 60 * 1000));
    if (dueSoonTime > new Date()) {
      notifications.push({
        taskId: task._id,
        type: 'due_soon',
        title: `Task Due Soon: ${task.title}`,
        message: `Your task "${task.title}" is due in ${task.notifications.reminderTime} hours.`,
        priority: task.priority,
        scheduledFor: dueSoonTime,
        userId: task.userId
      });
    }
    
    // Overdue notification (scheduled for due date)
    notifications.push({
      taskId: task._id,
      type: 'overdue',
      title: `Task Overdue: ${task.title}`,
      message: `Your task "${task.title}" is now overdue.`,
      priority: task.priority === 'low' ? 'medium' : 'high',
      scheduledFor: task.dueDate,
      userId: task.userId
    });
  }
  
  if (notifications.length > 0) {
    await this.insertMany(notifications);
  }
};

// Static method to get pending notifications
notificationSchema.statics.getPendingNotifications = async function(this: INotificationModel) {
  return await this.find({
    scheduledFor: { $lte: new Date() },
    sent: false
  }).populate('taskId');
};

// Static method to mark notifications as sent
notificationSchema.statics.markAsSent = async function(this: INotificationModel, notificationIds: string[]) {
  await this.updateMany(
    { _id: { $in: notificationIds } },
    { 
      sent: true, 
      sentAt: new Date() 
    }
  );
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = async function(this: INotificationModel, userId?: string, limit = 50) {
  const query = userId ? { userId } : {};
  return await this.find(query)
    .populate('taskId')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(this: INotificationModel, notificationIds: string[]) {
  await this.updateMany(
    { _id: { $in: notificationIds } },
    { read: true }
  );
};

// Static method to clean up old notifications
notificationSchema.statics.cleanupOldNotifications = async function(this: INotificationModel, daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  await this.deleteMany({
    createdAt: { $lt: cutoffDate },
    read: true
  });
};

const Notification = mongoose.model<INotification, INotificationModel>('Notification', notificationSchema);
export default Notification;