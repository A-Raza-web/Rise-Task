// src/routes/notificationRoutes.ts
import express from 'express';
import {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotifications,
  getPendingNotifications,
  markAsSent,
  getNotificationStats,
  cleanupOldNotifications,
  createNotification
} from '../controllers/notificationController';

const router = express.Router();

// Notification CRUD operations
router.get('/', getNotifications);                        // Get all notifications
router.get('/stats', getNotificationStats);               // Get notification statistics
router.get('/pending', getPendingNotifications);          // Get pending notifications
router.get('/:id', getNotificationById);                  // Get single notification
router.post('/', createNotification);                     // Create notification (manual/testing)

// Notification management operations
router.put('/mark-read', markAsRead);                     // Mark specific notifications as read
router.put('/mark-all-read', markAllAsRead);              // Mark all notifications as read
router.put('/mark-sent', markAsSent);                     // Mark notifications as sent
router.delete('/', deleteNotifications);                  // Delete notifications
router.delete('/cleanup', cleanupOldNotifications);       // Cleanup old notifications

export default router;