import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => console.log('MongoDB connection successful!'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes 
app.use("/api/tasks", taskRoutes);

export default app;
