import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBell,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTrash
} from 'react-icons/fa';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/notifications';

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}?limit=20`);
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await axios.put(`${API_URL}/mark-read`, { notificationIds });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/mark-all-read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotifications = async (notificationIds) => {
    try {
      await axios.delete(API_URL, { data: { notificationIds } });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'due_soon':
        return <FaClock className="text-warning" />;
      case 'overdue':
        return <FaExclamationTriangle className="text-danger" />;
      case 'completed':
        return <FaCheckCircle className="text-success" />;
      case 'reminder':
        return <FaBell className="text-info" />;
      default:
        return <FaBell className="text-info" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-danger';
      case 'high':
        return 'border-warning';
      case 'medium':
        return 'border-info';
      case 'low':
        return 'border-secondary';
      default:
        return 'border-secondary';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead([notification._id]);
    }
  };

  return (
    <div className="notification-center">
      {/* Notification Bell */}
      <div className="position-relative">
        <button
          className="btn btn-outline-secondary position-relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBell />
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div className="notification-dropdown position-absolute end-0 mt-2 shadow-lg">
            <div className="card" style={{ width: '400px', maxHeight: '500px' }}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <FaBell className="me-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                  )}
                </h6>
                <div>
                  {unreadCount > 0 && (
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={markAllAsRead}
                      title="Mark all as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <FaBell className="fs-1 mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`notification-item p-3 border-bottom border-start border-3 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'bg-light' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''}`}>
                              {notification.title}
                            </h6>
                            <div className="d-flex align-items-center">
                              {!notification.read && (
                                <span className="badge bg-primary me-2" style={{ fontSize: '0.6rem' }}>
                                  NEW
                                </span>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotifications([notification._id]);
                                }}
                                title="Delete notification"
                              >
                                <FaTrash style={{ fontSize: '0.7rem' }} />
                              </button>
                            </div>
                          </div>
                          <p className="mb-1 text-muted small">{notification.message}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {formatTimeAgo(notification.createdAt)}
                            </small>
                            <span className={`badge badge-${notification.priority}`}>
                              {notification.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="card-footer text-center">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      const allIds = notifications.map(n => n._id);
                      deleteNotifications(allIds);
                    }}
                  >
                    <FaTrash className="me-1" />
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;