// src/server.ts
import https from 'https';
import fs from 'fs';
import app from './App';
import dotenv from 'dotenv';
import { notificationService } from './services/notificationService';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

const httpsOptions = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
  console.log('Rise-Task API server started successfully!');
  
  // Wait for MongoDB connection before starting notification service
  const startNotificationService = () => {
    if (require('mongoose').connection.readyState === 1) {
      console.log('Starting notification service after MongoDB connection...');
      notificationService.start(5); // Check every 5 minutes
    } else {
      console.log('Waiting for MongoDB connection before starting notification service...');
      setTimeout(startNotificationService, 1000); // Check again in 1 second
    }
  };
  
  startNotificationService();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  notificationService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  notificationService.stop();
  process.exit(0);
});
