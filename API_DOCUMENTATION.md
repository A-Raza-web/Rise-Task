# Rise-Task API Documentation

## Overview

The Rise-Task API is a comprehensive task management system built with Node.js, Express, TypeScript, and MongoDB. It provides enhanced features including task priorities, categories, due dates, notifications, and advanced filtering capabilities.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API does not require authentication, but it's designed to support JWT authentication in the future.

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development mode)"
}
```

## Task Management

### Task Model
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  dueDate?: Date,
  category: string,
  status: 'pending' | 'in-progress' | 'completed',
  completed: boolean,
  tags: string[],
  notifications: {
    enabled: boolean,
    reminderTime: number, // hours before due date
    sent: boolean
  },
  createdAt: Date,
  updatedAt: Date,
  userId?: ObjectId // for future user authentication
}
```

### Endpoints

#### Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "category": "Work",
  "tags": ["documentation", "api", "urgent"],
  "notifications": {
    "enabled": true,
    "reminderTime": 24
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { /* created task object */ }
}
```

#### Get All Tasks
```http
GET /api/tasks
```

**Query Parameters:**
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `category` (string): Filter by category name
- `status` (string): Filter by status (pending, in-progress, completed)
- `completed` (boolean): Filter by completion status
- `dueDate` (string): Filter by due date (today, overdue, upcoming, this_week)
- `search` (string): Search in title, description, and tags
- `sortBy` (string): Sort field (createdAt, dueDate, priority, title)
- `sortOrder` (string): Sort order (asc, desc)
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page

**Example:**
```http
GET /api/tasks?priority=high&category=Work&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [/* array of tasks */],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalTasks": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get Single Task
```http
GET /api/tasks/:id
```

#### Update Task
```http
PUT /api/tasks/:id
```

**Request Body:** (partial update supported)
```json
{
  "title": "Updated task title",
  "priority": "urgent",
  "status": "in-progress"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Toggle Task Completion
```http
PATCH /api/tasks/:id/toggle
```

#### Get Task Statistics
```http
GET /api/tasks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTasks": 45,
      "completedTasks": 28,
      "pendingTasks": 12,
      "inProgressTasks": 5,
      "overdueTasks": 3,
      "todayTasks": 8
    },
    "categories": [
      { "_id": "Work", "count": 20, "completed": 15, "pending": 5 },
      { "_id": "Personal", "count": 15, "completed": 8, "pending": 7 }
    ],
    "priorities": [
      { "_id": "high", "count": 10, "completed": 6 },
      { "_id": "medium", "count": 25, "completed": 18 }
    ]
  }
}
```

#### Bulk Operations

##### Bulk Update Tasks
```http
PUT /api/tasks/bulk/update
```

**Request Body:**
```json
{
  "taskIds": ["task_id_1", "task_id_2"],
  "updateData": {
    "priority": "high",
    "category": "Urgent"
  }
}
```

##### Bulk Delete Tasks
```http
DELETE /api/tasks/bulk/delete
```

**Request Body:**
```json
{
  "taskIds": ["task_id_1", "task_id_2"]
}
```

## Category Management

### Category Model
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  color: string, // hex color code
  icon?: string,
  isDefault: boolean,
  taskCount: number,
  createdAt: Date,
  updatedAt: Date,
  userId?: ObjectId
}
```

### Endpoints

#### Get All Categories
```http
GET /api/categories
```

#### Get Single Category
```http
GET /api/categories/:id
```

#### Create Category
```http
POST /api/categories
```

**Request Body:**
```json
{
  "name": "Health & Fitness",
  "description": "Health and fitness related tasks",
  "color": "#28a745",
  "icon": "FaHeartbeat"
}
```

#### Update Category
```http
PUT /api/categories/:id
```

#### Delete Category
```http
DELETE /api/categories/:id
```

#### Get Category Statistics
```http
GET /api/categories/stats
```

#### Initialize Default Categories
```http
POST /api/categories/initialize-defaults
```

#### Update All Category Counts
```http
PUT /api/categories/update-counts
```

#### Move Tasks Between Categories
```http
PUT /api/categories/move-tasks
```

**Request Body:**
```json
{
  "fromCategory": "Old Category",
  "toCategory": "New Category"
}
```

## Notification Management

### Notification Model
```typescript
{
  _id: ObjectId,
  taskId: ObjectId,
  type: 'due_soon' | 'overdue' | 'completed' | 'reminder',
  title: string,
  message: string,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  read: boolean,
  sent: boolean,
  scheduledFor?: Date,
  sentAt?: Date,
  createdAt: Date,
  updatedAt: Date,
  userId?: ObjectId
}
```

### Endpoints

#### Get All Notifications
```http
GET /api/notifications
```

**Query Parameters:**
- `limit` (number): Number of notifications to return
- `unreadOnly` (boolean): Return only unread notifications
- `userId` (string): Filter by user ID (for future use)

#### Get Single Notification
```http
GET /api/notifications/:id
```

#### Mark Notifications as Read
```http
PUT /api/notifications/mark-read
```

**Request Body:**
```json
{
  "notificationIds": ["notification_id_1", "notification_id_2"]
}
```

#### Mark All Notifications as Read
```http
PUT /api/notifications/mark-all-read
```

#### Delete Notifications
```http
DELETE /api/notifications
```

**Request Body:**
```json
{
  "notificationIds": ["notification_id_1", "notification_id_2"]
}
```

#### Get Pending Notifications
```http
GET /api/notifications/pending
```

#### Get Notification Statistics
```http
GET /api/notifications/stats
```

#### Cleanup Old Notifications
```http
DELETE /api/notifications/cleanup?daysOld=30
```

#### Create Manual Notification
```http
POST /api/notifications
```

**Request Body:**
```json
{
  "taskId": "task_id",
  "type": "reminder",
  "title": "Custom Reminder",
  "message": "Don't forget to complete your task!",
  "priority": "medium",
  "scheduledFor": "2024-01-15T10:00:00.000Z"
}
```

## Health Check

#### API Health Status
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Rise-Task API is running",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Common Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Invalid input data. Title must be at least 3 characters long"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Database Error
```json
{
  "success": false,
  "message": "Database operation failed"
}
```

## Data Migration

### Run Migration Script
```bash
npm run migrate
```

This script will:
- Initialize default categories
- Migrate existing tasks to include new fields
- Update category task counts
- Display migration statistics

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- TypeScript

### Installation
```bash
# Install dependencies
npm install

# Install TypeScript types
npm install --save-dev @types/cors

# Run development server
npm run dev

# Run migration
npm run migrate

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env` file in the backend root:
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/RiseTaskDB
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Notification endpoints: 50 requests per 15 minutes
- Bulk operations: 10 requests per 15 minutes

## Future Enhancements

- JWT Authentication and Authorization
- User Management System
- Real-time WebSocket Notifications
- File Attachments for Tasks
- Task Templates
- Advanced Reporting and Analytics
- Mobile App API Support
- Third-party Integrations (Google Calendar, Slack, etc.)

## Support

For issues and questions, please refer to the project repository or contact the development team.