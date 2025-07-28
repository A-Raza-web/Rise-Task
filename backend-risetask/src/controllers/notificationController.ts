// src/controllers/notificationController.ts
import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Get all notifications for a user
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    const userId = req.query.userId as string; // Will be from auth middleware in future

    const filter: any = {};
    if (userId) filter.userId = userId;
    if (unreadOnly === 'true') filter.read = false;

    const notifications = await Notification.find(filter)
      .populate('taskId')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Get notification by ID
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id).populate('taskId');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification',
      error: error.message
    });
  }
};

// Mark notifications as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs array is required'
      });
    }

    await Notification.markAsRead(notificationIds);

    res.status(200).json({
      success: true,
      message: 'Notifications marked as read'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string; // Will be from auth middleware in future

    const filter: any = { read: false };
    if (userId) filter.userId = userId;

    await Notification.updateMany(filter, { read: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// Delete notifications
export const deleteNotifications = async (req: Request, res: Response) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs array is required'
      });
    }

    const result = await Notification.deleteMany({
      _id: { $in: notificationIds }
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notifications',
      error: error.message
    });
  }
};

// Get pending notifications (for notification service)
export const getPendingNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.getPendingNotifications();

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending notifications',
      error: error.message
    });
  }
};

// Mark notifications as sent (for notification service)
export const markAsSent = async (req: Request, res: Response) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs array is required'
      });
    }

    await Notification.markAsSent(notificationIds);

    res.status(200).json({
      success: true,
      message: 'Notifications marked as sent'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as sent',
      error: error.message
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string; // Will be from auth middleware in future

    const filter: any = {};
    if (userId) filter.userId = userId;

    const stats = await Notification.aggregate([
      { $match: filter },
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

    const typeStats = await Notification.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: { $sum: { $cond: ['$read', 0, 1] } }
        }
      }
    ]);

    const priorityStats = await Notification.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          unread: { $sum: { $cond: ['$read', 0, 1] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalNotifications: 0,
          unreadNotifications: 0,
          sentNotifications: 0,
          pendingNotifications: 0
        },
        byType: typeStats,
        byPriority: priorityStats
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    });
  }
};

// Clean up old notifications
export const cleanupOldNotifications = async (req: Request, res: Response) => {
  try {
    const { daysOld = 30 } = req.query;

    await Notification.cleanupOldNotifications(Number(daysOld));

    res.status(200).json({
      success: true,
      message: `Old notifications (${daysOld} days) cleaned up successfully`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup old notifications',
      error: error.message
    });
  }
};

// Create manual notification (for testing or admin purposes)
export const createNotification = async (req: Request, res: Response) => {
  try {
    const notificationData = req.body;

    const notification = await Notification.create(notificationData);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};