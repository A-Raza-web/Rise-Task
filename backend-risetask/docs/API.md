# Rise-Task Backend API Documentation

## Overview

The Rise-Task Backend API provides a comprehensive task management system with support for categories, notifications, and statistics. This RESTful API is built with Node.js, Express, TypeScript, and MongoDB.

**Base URL**: `https://localhost:3000/api`  
**Version**: 1.0.0  
**Authentication**: JWT (Future implementation)

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Tasks](#tasks)
  - [Categories](#categories)
  - [Notifications](#notifications)
  - [Statistics](#statistics)
- [Data Models](#data-models)
- [Response Formats](#response-formats)
- [Status Codes](#status-codes)

## Authentication

*Note: Authentication is planned for future implementation*

Currently, the API does not require authentication. All endpoints are publicly accessible.

**Planned Authentication Flow:**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

## Error Handling

The API uses consistent error response format across all endpoints:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### Common Error Types

- **Validation Error (400)**: Invalid request data
- **Cast Error (400)**: Invalid ObjectId format
- **Not Found (404)**: Resource not found
- **Rate Limit (429)**: Too many requests
- **Server Error (500)**: Internal server error

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Endpoints

### Health Check

#### GET /api/health

Check API server status and connectivity.

**Response:**
```json
{
  "success": true,
  "message": "Rise-Task API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

---

### Tasks

#### GET /api/tasks

Retrieve all tasks with optional filtering, sorting, and pagination.

**Query Parameters:**
- `priority` (string): Filter by priority (`low`, `medium`, `high`, `urgent`)
- `category` (string): Filter by category name
- `status` (string): Filter by status (`pending`, `in-progress`, `completed`)
- `completed` (boolean): Filter by completion status
- `dueDate` (string): Filter by due date (`today`, `overdue`, `upcoming`, `this_week`)
- `search` (string): Search in title, description, and tags
- `sortBy` (string): Sort field (`createdAt`, `dueDate`, `priority`, `title`)
- `sortOrder` (string): Sort direction (`asc`, `desc`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50, max: 100)

**Example Request:**
```
GET /api/tasks?priority=high&status=pending&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project proposal",
      "description": "Finish writing the Q1 project proposal",
      "priority": "high",
      "category": "Work",
      "status": "in-progress",
      "completed": false,
      "tags": ["project", "proposal"],
      "dueDate": "2024-01-15T09:00:00.000Z",
      "notifications": {
        "enabled": true,
        "reminderTime": 24,
        "sent": false
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "isOverdue": false,
      "daysUntilDue": 14,
      "priorityWeight": 3
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTasks": 47,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### POST /api/tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Finish writing the Q1 project proposal with budget estimates",
  "priority": "high",
  "category": "Work",
  "tags": ["project", "proposal", "deadline"],
  "dueDate": "2024-01-15T09:00:00.000Z",
  "notifications": {
    "enabled": true,
    "reminderTime": 24
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project proposal",
    "description": "Finish writing the Q1 project proposal with budget estimates",
    "priority": "high",
    "category": "Work",
    "status": "pending",
    "completed": false,
    "tags": ["project", "proposal", "deadline"],
    "dueDate": "2024-01-15T09:00:00.000Z",
    "notifications": {
      "enabled": true,
      "reminderTime": 24,
      "sent": false
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### GET /api/tasks/:id

Retrieve a specific task by ID.

**Parameters:**
- `id` (string): Task ObjectId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project proposal",
    "description": "Finish writing the Q1 project proposal",
    "priority": "high",
    "category": "Work",
    "status": "in-progress",
    "completed": false,
    "tags": ["project", "proposal"],
    "dueDate": "2024-01-15T09:00:00.000Z",
    "notifications": {
      "enabled": true,
      "reminderTime": 24,
      "sent": false
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### PUT /api/tasks/:id

Update a specific task.

**Parameters:**
- `id` (string): Task ObjectId

**Request Body:** (Partial task object)
```json
{
  "status": "completed",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project proposal",
    "status": "completed",
    "completed": true,
    "updatedAt": "2024-01-01T15:30:00.000Z"
  }
}
```

#### DELETE /api/tasks/:id

Delete a specific task.

**Parameters:**
- `id` (string): Task ObjectId

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### PATCH /api/tasks/:id/toggle

Toggle task completion status.

**Parameters:**
- `id` (string): Task ObjectId

**Response (200):**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "completed": true,
    "status": "completed",
    "updatedAt": "2024-01-01T15:30:00.000Z"
  }
}
```

#### GET /api/tasks/stats

Get task statistics and analytics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 47,
      "completed": 23,
      "pending": 18,
      "overdue": 6
    },
    "categories": [
      {
        "_id": "Work",
        "count": 15
      },
      {
        "_id": "Personal",
        "count": 12
      }
    ],
    "priorities": [
      {
        "_id": "high",
        "count": 8
      },
      {
        "_id": "medium",
        "count": 25
      }
    ]
  }
}
```

#### PUT /api/tasks/bulk/update

Bulk update multiple tasks.

**Request Body:**
```json
{
  "taskIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "updateData": {
    "priority": "high",
    "category": "Work"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2 tasks updated successfully",
  "data": {
    "modifiedCount": 2
  }
}
```

#### DELETE /api/tasks/bulk/delete

Bulk delete multiple tasks.

**Request Body:**
```json
{
  "taskIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2 tasks deleted successfully",
  "data": {
    "deletedCount": 2
  }
}
```

---

### Categories

#### GET /api/categories

Retrieve all categories with task counts.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Work",
      "description": "Work-related tasks and projects",
      "color": "#3498db",
      "icon": "briefcase",
      "taskCount": 15,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### Notifications

#### GET /api/notifications

Retrieve all notifications with optional filtering.

**Query Parameters:**
- `type` (string): Filter by notification type
- `sent` (boolean): Filter by sent status
- `priority` (string): Filter by priority

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "taskId": "507f1f77bcf86cd799439011",
      "type": "reminder",
      "title": "Task Due Soon",
      "message": "Your task 'Complete project proposal' is due in 24 hours",
      "priority": "medium",
      "sent": false,
      "scheduledFor": "2024-01-14T09:00:00.000Z",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### Statistics

#### GET /api/stats

Get comprehensive application statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": {
      "total": 47,
      "completed": 23,
      "pending": 18,
      "inProgress": 6,
      "overdue": 4
    },
    "categories": {
      "total": 6,
      "mostUsed": "Work"
    },
    "notifications": {
      "total": 12,
      "sent": 8,
      "pending": 4
    },
    "productivity": {
      "completionRate": 48.9,
      "averageCompletionTime": 3.2
    }
  }
}
```

## Data Models

### Task Model

```typescript
interface ITask {
  _id: ObjectId;
  title: string;                    // 3-100 characters
  description: string;              // 10-500 characters
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;                   // Optional, must be future date
  category: string;                 // Default: 'General'
  status: 'pending' | 'in-progress' | 'completed';
  completed: boolean;               // Default: false
  tags: string[];                   // Max 20 characters per tag
  notifications: {
    enabled: boolean;               // Default: true
    reminderTime: number;           // Hours before due date (1-168)
    sent: boolean;                  // Default: false
  };
  createdAt: Date;
  updatedAt: Date;
  userId?: ObjectId;                // For future user authentication
  
  // Virtual fields
  isOverdue: boolean;
  daysUntilDue: number | null;
  priorityWeight: number;
}
```

### Category Model

```typescript
interface ICategory {
  _id: ObjectId;
  name: string;                     // Unique, required
  description?: string;
  color: string;                    // Hex color code
  icon?: string;                    // Icon identifier
  taskCount: number;                // Auto-calculated
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification Model

```typescript
interface INotification {
  _id: ObjectId;
  taskId: ObjectId;
  type: 'reminder' | 'overdue' | 'completed';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  sent: boolean;                    // Default: false
  sentAt?: Date;
  scheduledFor: Date;
  userId?: ObjectId;                // For future user authentication
  createdAt: Date;
  updatedAt: Date;
}
```

## Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* Response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ /* Array of items */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTasks": 47,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Status Codes

- **200 OK**: Successful GET, PUT, PATCH, DELETE
- **201 Created**: Successful POST
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required (future)
- **403 Forbidden**: Access denied (future)
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Examples

### Creating a Task with Notifications

```bash
curl -X POST https://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review code changes",
    "description": "Review pull request #123 and provide feedback",
    "priority": "high",
    "category": "Work",
    "dueDate": "2024-01-15T17:00:00.000Z",
    "tags": ["review", "code", "urgent"],
    "notifications": {
      "enabled": true,
      "reminderTime": 2
    }
  }'
```

### Filtering Tasks by Multiple Criteria

```bash
curl "https://localhost:3000/api/tasks?priority=high&status=pending&category=Work&sortBy=dueDate&sortOrder=asc"
```

### Bulk Operations

```bash
# Bulk update
curl -X PUT https://localhost:3000/api/tasks/bulk/update \
  -H "Content-Type: application/json" \
  -d '{
    "taskIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "updateData": {"priority": "urgent"}
  }'

# Bulk delete
curl -X DELETE https://localhost:3000/api/tasks/bulk/delete \
  -H "Content-Type: application/json" \
  -d '{
    "taskIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
  }'
```

## Development Notes

### Test Endpoints (Development Only)

**⚠️ Warning**: These endpoints are for testing error handling and should be removed before production deployment.

- `GET /api/tasks/test-errors` - List all test error endpoints
- `GET /api/tasks/test-errors/custom` - Test custom error (422)
- `GET /api/tasks/test-errors/cast` - Test cast error (400)
- `GET /api/tasks/test-errors/sync` - Test synchronous error (500)
- `GET /api/tasks/test-errors/rate-limit` - Test rate limiting (429)
- `GET /api/tasks/test-errors/jwt` - Test JWT error (401)
- `GET /api/tasks/test-errors/jwt-expired` - Test JWT expired error (401)

### Environment Configuration

Ensure these environment variables are properly configured:

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/RiseTaskDB
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

### SSL/HTTPS

The API runs on HTTPS with self-signed certificates for development. For production, use proper SSL certificates.

---

**Last Updated**: January 2024  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0