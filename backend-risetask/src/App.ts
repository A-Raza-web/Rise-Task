import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import statsRoutes from './routes/statsRoutes';
import categoryRoutes from './routes/categoryRoutes';
import notificationRoutes from './routes/notificationRoutes';
import Category from './models/Category';
import {
  globalErrorHandler,
  notFound,
  handleDatabaseError,
  handleUncaughtException,
  handleUnhandledRejection
} from './middleware/errorHandler';

// Handle uncaught exceptions
handleUncaughtException();

dotenv.config();

const app: Express = express();

// Handle unhandled promise rejections
handleUnhandledRejection();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI as string, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxPoolSize: 10,
} as mongoose.ConnectOptions)
.then(async () => {
  console.log('✅ MongoDB connection successful!');
  console.log('🔗 Connected to database:', mongoose.connection.db?.databaseName);
  
  // Initialize default categories on startup
  try {
    await Category.initializeDefaults();
    console.log('✅ Default categories initialized');
  } catch (error) {
    console.error('❌ Error initializing default categories:', error);
  }
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  handleDatabaseError(err);
});

// Monitor connection events
mongoose.connection.on('error', (err) => {
  console.error('🚨 MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rise-Task API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle 404 errors
app.all('*', notFound);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

export default app;
