/**
 * Logging System for Rise-Task Backend
 * Provides structured logging with multiple levels and output formats
 * 
 * @description This module creates a comprehensive logging system that supports
 * different log levels, file rotation, and structured output for monitoring.
 */

import fs from 'fs';
import path from 'path';

/**
 * Log levels with numeric priorities
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

/**
 * Log entry interface
 */
interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
  stack?: string;
  requestId?: string;
  userId?: string;
  ip?: string;
}

/**
 * Logger configuration interface
 */
interface LoggerConfig {
  level: LogLevel;
  console: boolean;
  file: boolean;
  logDir: string;
  logFile: string;
  errorFile: string;
  maxFileSize: number; // in bytes
  maxFiles: number;
  format: 'json' | 'text';
  includeStack: boolean;
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  console: true,
  file: true,
  logDir: 'logs',
  logFile: 'app.log',
  errorFile: 'error.log',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  format: 'json',
  includeStack: process.env.NODE_ENV === 'development'
};

/**
 * Logger class with multiple output targets and formatting options
 */
class Logger {
  private config: LoggerConfig;
  private logFilePath: string;
  private errorFilePath: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.logFilePath = path.join(this.config.logDir, this.config.logFile);
    this.errorFilePath = path.join(this.config.logDir, this.config.errorFile);
    
    this.ensureLogDirectory();
  }

  /**
   * Ensures the log directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  /**
   * Gets the current timestamp in ISO format
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Formats log entry based on configuration
   */
  private formatLogEntry(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return JSON.stringify(entry);
    } else {
      const { timestamp, level, message, meta, requestId, userId, ip } = entry;
      let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      
      if (requestId) formatted += ` [req:${requestId}]`;
      if (userId) formatted += ` [user:${userId}]`;
      if (ip) formatted += ` [ip:${ip}]`;
      if (meta) formatted += ` ${JSON.stringify(meta)}`;
      
      return formatted;
    }
  }

  /**
   * Gets console color for log level
   */
  private getConsoleColor(level: LogLevel): string {
    const colors = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[37m'  // White
    };
    return colors[level] || '\x1b[37m';
  }

  /**
   * Resets console color
   */
  private resetConsoleColor(): string {
    return '\x1b[0m';
  }

  /**
   * Writes log entry to console with colors
   */
  private writeToConsole(entry: LogEntry, level: LogLevel): void {
    if (!this.config.console) return;

    const color = this.getConsoleColor(level);
    const reset = this.resetConsoleColor();
    const formatted = this.formatLogEntry(entry);
    
    console.log(`${color}${formatted}${reset}`);
    
    if (entry.stack && this.config.includeStack) {
      console.log(`${color}${entry.stack}${reset}`);
    }
  }

  /**
   * Rotates log file if it exceeds maximum size
   */
  private rotateLogFile(filePath: string): void {
    if (!fs.existsSync(filePath)) return;

    const stats = fs.statSync(filePath);
    if (stats.size < this.config.maxFileSize) return;

    // Rotate existing files
    for (let i = this.config.maxFiles - 1; i > 0; i--) {
      const oldFile = `${filePath}.${i}`;
      const newFile = `${filePath}.${i + 1}`;
      
      if (fs.existsSync(oldFile)) {
        if (i === this.config.maxFiles - 1) {
          fs.unlinkSync(oldFile); // Delete oldest file
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }

    // Move current file to .1
    fs.renameSync(filePath, `${filePath}.1`);
  }

  /**
   * Writes log entry to file
   */
  private writeToFile(entry: LogEntry, level: LogLevel): void {
    if (!this.config.file) return;

    const filePath = level === LogLevel.ERROR ? this.errorFilePath : this.logFilePath;
    
    try {
      this.rotateLogFile(filePath);
      
      const formatted = this.formatLogEntry(entry) + '\n';
      fs.appendFileSync(filePath, formatted);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Creates a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    meta?: any,
    error?: Error,
    context?: { requestId?: string; userId?: string; ip?: string }
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: LogLevel[level].toLowerCase(),
      message,
      ...context
    };

    if (meta) {
      entry.meta = meta;
    }

    if (error && this.config.includeStack) {
      entry.stack = error.stack;
    }

    return entry;
  }

  /**
   * Logs a message at the specified level
   */
  private log(
    level: LogLevel,
    message: string,
    meta?: any,
    error?: Error,
    context?: { requestId?: string; userId?: string; ip?: string }
  ): void {
    if (level > this.config.level) return;

    const entry = this.createLogEntry(level, message, meta, error, context);
    
    this.writeToConsole(entry, level);
    this.writeToFile(entry, level);
  }

  /**
   * Logs an error message
   */
  error(message: string, error?: Error, meta?: any, context?: { requestId?: string; userId?: string; ip?: string }): void {
    this.log(LogLevel.ERROR, message, meta, error, context);
  }

  /**
   * Logs a warning message
   */
  warn(message: string, meta?: any, context?: { requestId?: string; userId?: string; ip?: string }): void {
    this.log(LogLevel.WARN, message, meta, undefined, context);
  }

  /**
   * Logs an info message
   */
  info(message: string, meta?: any, context?: { requestId?: string; userId?: string; ip?: string }): void {
    this.log(LogLevel.INFO, message, meta, undefined, context);
  }

  /**
   * Logs a debug message
   */
  debug(message: string, meta?: any, context?: { requestId?: string; userId?: string; ip?: string }): void {
    this.log(LogLevel.DEBUG, message, meta, undefined, context);
  }

  /**
   * Creates a child logger with persistent context
   */
  child(context: { requestId?: string; userId?: string; ip?: string }): Logger {
    const childLogger = new Logger(this.config);
    
    // Override log methods to include context
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level: LogLevel, message: string, meta?: any, error?: Error, additionalContext?: any) => {
      const mergedContext = { ...context, ...additionalContext };
      originalLog(level, message, meta, error, mergedContext);
    };

    return childLogger;
  }

  /**
   * Sets the log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Gets current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Clears log files
   */
  clearLogs(): void {
    try {
      if (fs.existsSync(this.logFilePath)) {
        fs.unlinkSync(this.logFilePath);
      }
      if (fs.existsSync(this.errorFilePath)) {
        fs.unlinkSync(this.errorFilePath);
      }
      
      // Clear rotated files
      for (let i = 1; i <= this.config.maxFiles; i++) {
        const rotatedLog = `${this.logFilePath}.${i}`;
        const rotatedError = `${this.errorFilePath}.${i}`;
        
        if (fs.existsSync(rotatedLog)) fs.unlinkSync(rotatedLog);
        if (fs.existsSync(rotatedError)) fs.unlinkSync(rotatedError);
      }
      
      this.info('Log files cleared');
    } catch (error) {
      console.error('Failed to clear log files:', error);
    }
  }

  /**
   * Gets log file statistics
   */
  getLogStats(): { logFile: any; errorFile: any } {
    const getFileStats = (filePath: string) => {
      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            exists: true
          };
        }
        return { exists: false };
      } catch {
        return { exists: false, error: true };
      }
    };

    return {
      logFile: getFileStats(this.logFilePath),
      errorFile: getFileStats(this.errorFilePath)
    };
  }
}

/**
 * Creates logger instance based on environment configuration
 */
function createLogger(): Logger {
  const logLevel = process.env.LOG_LEVEL?.toLowerCase();
  const level = logLevel === 'error' ? LogLevel.ERROR :
                logLevel === 'warn' ? LogLevel.WARN :
                logLevel === 'debug' ? LogLevel.DEBUG :
                LogLevel.INFO;

  return new Logger({
    level,
    logDir: process.env.LOG_DIR || 'logs',
    logFile: process.env.LOG_FILE || 'app.log',
    errorFile: process.env.ERROR_LOG_FILE || 'error.log',
    console: process.env.NODE_ENV !== 'test',
    file: process.env.LOG_TO_FILE !== 'false',
    format: process.env.LOG_FORMAT === 'text' ? 'text' : 'json',
    includeStack: process.env.NODE_ENV === 'development'
  });
}

/**
 * Express middleware for request logging
 */
export function requestLogger(logger: Logger) {
  return (req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] || Math.random().toString(36).substr(2, 9);
    const startTime = Date.now();
    
    // Add request ID to request object
    req.requestId = requestId;
    
    // Create child logger with request context
    req.logger = logger.child({
      requestId,
      ip: req.ip || req.connection.remoteAddress
    });

    // Log request start
    req.logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.headers['user-agent'],
      contentLength: req.headers['content-length']
    });

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const level = res.statusCode >= 400 ? 'warn' : 'info';
      
      req.logger[level](`${req.method} ${req.originalUrl} ${res.statusCode}`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        contentLength: res.get('content-length')
      });
    });

    next();
  };
}

// Create and export default logger instance
export const logger = createLogger();
export { Logger };
export default logger;