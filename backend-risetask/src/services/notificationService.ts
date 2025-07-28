// src/services/notificationService.ts
import Notification from '../models/Notification';
import Task from '../models/taskModel';

export class NotificationService {
  private static instance: NotificationService;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Start the notification service
  public start(intervalMinutes: number = 5): void {
    if (this.intervalId) {
      console.log('Notification service is already running');
      return;
    }

    console.log(`Starting notification service with ${intervalMinutes} minute intervals`);
    
    // Run immediately on start
    this.processNotifications();

    // Set up recurring processing
    this.intervalId = setInterval(() => {
      this.processNotifications();
    }, intervalMinutes * 60 * 1000);
  }

  // Stop the notification service
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Notification service stopped');
    }
  }

  // Process pending notifications
  private async processNotifications(): Promise<void> {
    try {
      console.log('Processing notifications...');
      
      // Get pending notifications
      const pendingNotifications = await Notification.getPendingNotifications();
      
      if (pendingNotifications.length === 0) {
        console.log('No pending notifications to process');
        return;
      }

      console.log(`Processing ${pendingNotifications.length} pending notifications`);

      // Process each notification
      const processedIds: string[] = [];
      
      for (const notification of pendingNotifications) {
        try {
          // Check if the associated task still exists and is not completed
          if (notification.taskId) {
            const task = await Task.findById(notification.taskId);
            
            // Skip notification if task is completed or doesn't exist
            if (!task || task.completed) {
              await Notification.findByIdAndDelete(notification._id);
              console.log(`Deleted notification for completed/missing task: ${notification.title}`);
              continue;
            }

            // For overdue notifications, only send if task is actually overdue
            if (notification.type === 'overdue' && task.dueDate && task.dueDate > new Date()) {
              continue; // Skip if not actually overdue yet
            }
          }

          // Simulate sending notification (in a real app, this would send email, push notification, etc.)
          await this.sendNotification(notification);
          processedIds.push((notification._id as any).toString());
          
        } catch (error) {
          console.error(`Error processing notification ${notification._id}:`, error);
        }
      }

      // Mark processed notifications as sent
      if (processedIds.length > 0) {
        await Notification.markAsSent(processedIds);
        console.log(`Marked ${processedIds.length} notifications as sent`);
      }

    } catch (error) {
      console.error('Error in notification processing:', error);
    }
  }

  // Simulate sending a notification
  private async sendNotification(notification: any): Promise<void> {
    // In a real application, this would integrate with:
    // - Email service (SendGrid, AWS SES, etc.)
    // - Push notification service (Firebase, OneSignal, etc.)
    // - SMS service (Twilio, etc.)
    // - WebSocket for real-time notifications
    
    console.log(`📧 NOTIFICATION SENT:`, {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      taskId: notification.taskId
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Create notifications for a task
  public async createTaskNotifications(task: any): Promise<void> {
    try {
      await Notification.createTaskNotifications(task);
      console.log(`Created notifications for task: ${task.title}`);
    } catch (error) {
      console.error('Error creating task notifications:', error);
    }
  }

  // Clean up old notifications
  public async cleanupOldNotifications(daysOld: number = 30): Promise<void> {
    try {
      await Notification.cleanupOldNotifications(daysOld);
      console.log(`Cleaned up notifications older than ${daysOld} days`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }

  // Get notification statistics
  public async getStats(): Promise<any> {
    try {
      const stats = await Notification.aggregate([
        {
          $group: {
            _id: null,
            totalNotifications: { $sum: 1 },
            unreadNotifications: { $sum: { $cond: ['$read', 0, 1] } },
            sentNotifications: { $sum: { $cond: ['$sent', 1, 0] } },
            pendingNotifications: { $sum: { $cond: ['$sent', 0, 1] } }
          }
        }
      ]);

      return stats[0] || {
        totalNotifications: 0,
        unreadNotifications: 0,
        sentNotifications: 0,
        pendingNotifications: 0
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return null;
    }
  }

  // Manual notification creation (for testing or admin purposes)
  public async createManualNotification(data: {
    taskId: string;
    type: 'due_soon' | 'overdue' | 'completed' | 'reminder';
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    scheduledFor?: Date;
    userId?: string;
  }): Promise<any> {
    try {
      const notification = await Notification.create({
        ...data,
        priority: data.priority || 'medium'
      });
      
      console.log(`Manual notification created: ${notification.title}`);
      return notification;
    } catch (error) {
      console.error('Error creating manual notification:', error);
      throw error;
    }
  }

  // Check service status
  public getStatus(): { running: boolean; intervalId: NodeJS.Timeout | null } {
    return {
      running: this.intervalId !== null,
      intervalId: this.intervalId
    };
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();