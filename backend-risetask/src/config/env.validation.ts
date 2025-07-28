/**
 * Environment Configuration Validation
 * Validates and processes environment variables for the Rise-Task backend
 * 
 * @description This module ensures all required environment variables are present
 * and properly formatted before the application starts.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * Environment variable definitions with validation rules
 */
interface EnvVarDefinition {
  key: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'path';
  default?: any;
  description: string;
  validation?: (value: any) => boolean;
  transform?: (value: string) => any;
}

/**
 * Environment configuration schema
 */
const ENV_SCHEMA: EnvVarDefinition[] = [
  // Server Configuration
  {
    key: 'PORT',
    required: false,
    type: 'number',
    default: 3000,
    description: 'Server port number',
    validation: (value: number) => value > 0 && value <= 65535
  },
  {
    key: 'NODE_ENV',
    required: false,
    type: 'string',
    default: 'development',
    description: 'Node.js environment',
    validation: (value: string) => ['development', 'production', 'test', 'staging'].includes(value)
  },

  // Database Configuration
  {
    key: 'MONGODB_URI',
    required: true,
    type: 'string',
    description: 'MongoDB connection string',
    validation: (value: string) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://')
  },
  {
    key: 'DB_MAX_POOL_SIZE',
    required: false,
    type: 'number',
    default: 10,
    description: 'Maximum database connection pool size',
    validation: (value: number) => value > 0 && value <= 100
  },
  {
    key: 'DB_SERVER_SELECTION_TIMEOUT',
    required: false,
    type: 'number',
    default: 5000,
    description: 'Database server selection timeout (ms)',
    validation: (value: number) => value > 0
  },
  {
    key: 'DB_SOCKET_TIMEOUT',
    required: false,
    type: 'number',
    default: 45000,
    description: 'Database socket timeout (ms)',
    validation: (value: number) => value > 0
  },

  // Authentication & Security
  {
    key: 'JWT_SECRET',
    required: true,
    type: 'string',
    description: 'JWT signing secret',
    validation: (value: string) => value.length >= 32
  },
  {
    key: 'JWT_EXPIRES_IN',
    required: false,
    type: 'string',
    default: '7d',
    description: 'JWT token expiration time'
  },
  {
    key: 'BCRYPT_ROUNDS',
    required: false,
    type: 'number',
    default: 12,
    description: 'Bcrypt hashing rounds',
    validation: (value: number) => value >= 10 && value <= 15
  },

  // SSL/TLS Configuration
  {
    key: 'SSL_KEY_PATH',
    required: false,
    type: 'path',
    default: 'cert/key.pem',
    description: 'SSL private key file path'
  },
  {
    key: 'SSL_CERT_PATH',
    required: false,
    type: 'path',
    default: 'cert/cert.pem',
    description: 'SSL certificate file path'
  },
  {
    key: 'SSL_ENABLED',
    required: false,
    type: 'boolean',
    default: true,
    description: 'Enable SSL/TLS'
  },

  // CORS Configuration
  {
    key: 'CORS_ORIGINS',
    required: false,
    type: 'string',
    default: 'http://localhost:3000,http://localhost:5173',
    description: 'Allowed CORS origins (comma-separated)',
    transform: (value: string) => value.split(',').map(origin => origin.trim())
  },
  {
    key: 'CORS_CREDENTIALS',
    required: false,
    type: 'boolean',
    default: true,
    description: 'Allow CORS credentials'
  },

  // Logging Configuration
  {
    key: 'LOG_LEVEL',
    required: false,
    type: 'string',
    default: 'info',
    description: 'Logging level',
    validation: (value: string) => ['error', 'warn', 'info', 'debug'].includes(value)
  },
  {
    key: 'LOG_DIR',
    required: false,
    type: 'string',
    default: 'logs',
    description: 'Log files directory'
  },

  // Notification Configuration
  {
    key: 'NOTIFICATION_ENABLED',
    required: false,
    type: 'boolean',
    default: true,
    description: 'Enable notification service'
  },
  {
    key: 'NOTIFICATION_CHECK_INTERVAL',
    required: false,
    type: 'number',
    default: 5,
    description: 'Notification check interval (minutes)',
    validation: (value: number) => value > 0 && value <= 60
  },

  // Rate Limiting
  {
    key: 'RATE_LIMIT_ENABLED',
    required: false,
    type: 'boolean',
    default: true,
    description: 'Enable rate limiting'
  },
  {
    key: 'RATE_LIMIT_WINDOW_MS',
    required: false,
    type: 'number',
    default: 900000,
    description: 'Rate limit window (ms)',
    validation: (value: number) => value > 0
  },
  {
    key: 'RATE_LIMIT_MAX_REQUESTS',
    required: false,
    type: 'number',
    default: 100,
    description: 'Maximum requests per window',
    validation: (value: number) => value > 0
  }
];

/**
 * Validation result interface
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, any>;
}

/**
 * Type conversion utilities
 */
const typeConverters = {
  string: (value: string) => value,
  number: (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) throw new Error(`Invalid number: ${value}`);
    return num;
  },
  boolean: (value: string) => {
    const lower = value.toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(lower)) return true;
    if (['false', '0', 'no', 'off'].includes(lower)) return false;
    throw new Error(`Invalid boolean: ${value}`);
  },
  url: (value: string) => {
    try {
      new URL(value);
      return value;
    } catch {
      throw new Error(`Invalid URL: ${value}`);
    }
  },
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) throw new Error(`Invalid email: ${value}`);
    return value;
  },
  path: (value: string) => {
    return path.resolve(value);
  }
};

/**
 * Validates a single environment variable
 * @param definition - Environment variable definition
 * @param rawValue - Raw string value from environment
 * @returns Processed and validated value
 */
function validateEnvVar(definition: EnvVarDefinition, rawValue?: string): any {
  // Handle missing values
  if (!rawValue) {
    if (definition.required) {
      throw new Error(`Required environment variable ${definition.key} is missing`);
    }
    return definition.default;
  }

  // Convert type
  let value: any;
  try {
    value = typeConverters[definition.type](rawValue);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`${definition.key}: ${errorMessage}`);
  }

  // Apply custom transformation
  if (definition.transform) {
    value = definition.transform(rawValue);
  }

  // Validate value
  if (definition.validation && !definition.validation(value)) {
    throw new Error(`${definition.key}: validation failed for value "${value}"`);
  }

  return value;
}

/**
 * Validates file paths exist
 * @param filePath - Path to validate
 * @returns True if file exists
 */
function validateFilePath(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Validates all environment variables
 * @returns Validation result with processed configuration
 */
export function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    config: {}
  };

  // Validate each environment variable
  for (const definition of ENV_SCHEMA) {
    try {
      const rawValue = process.env[definition.key];
      const processedValue = validateEnvVar(definition, rawValue);
      result.config[definition.key] = processedValue;

      // Additional file path validation
      if (definition.type === 'path' && processedValue) {
        if (!validateFilePath(processedValue)) {
          result.warnings.push(`File not found: ${definition.key}=${processedValue}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.errors.push(errorMessage);
      result.valid = false;
    }
  }

  // Environment-specific validations
  const nodeEnv = result.config.NODE_ENV || 'development';
  
  if (nodeEnv === 'production') {
    // Production-specific validations
    if (result.config.JWT_SECRET === 'your_super_secure_jwt_secret_key_here_change_in_production') {
      result.errors.push('JWT_SECRET must be changed from default value in production');
      result.valid = false;
    }

    if (result.config.BCRYPT_ROUNDS < 12) {
      result.warnings.push('BCRYPT_ROUNDS should be at least 12 in production');
    }

    if (!result.config.SSL_ENABLED) {
      result.warnings.push('SSL should be enabled in production');
    }
  }

  // SSL certificate validation
  if (result.config.SSL_ENABLED) {
    const keyPath = result.config.SSL_KEY_PATH;
    const certPath = result.config.SSL_CERT_PATH;

    if (!validateFilePath(keyPath)) {
      result.warnings.push(`SSL key file not found: ${keyPath}`);
    }

    if (!validateFilePath(certPath)) {
      result.warnings.push(`SSL certificate file not found: ${certPath}`);
    }
  }

  return result;
}

/**
 * Prints validation results to console
 * @param result - Validation result
 */
export function printValidationResult(result: ValidationResult): void {
  console.log('\n🔧 Environment Configuration Validation');
  console.log('=' .repeat(50));

  if (result.valid) {
    console.log('✅ Environment validation passed');
  } else {
    console.log('❌ Environment validation failed');
  }

  if (result.errors.length > 0) {
    console.log('\n🚨 ERRORS:');
    result.errors.forEach(error => console.log(`   ❌ ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    result.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
  }

  console.log('\n📋 Configuration Summary:');
  console.log(`   Environment: ${result.config.NODE_ENV}`);
  console.log(`   Port: ${result.config.PORT}`);
  console.log(`   Database: ${result.config.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  console.log(`   JWT Secret: ${result.config.JWT_SECRET ? 'Set' : 'Not set'}`);
  console.log(`   SSL Enabled: ${result.config.SSL_ENABLED ? 'Yes' : 'No'}`);
  console.log(`   Notifications: ${result.config.NOTIFICATION_ENABLED ? 'Enabled' : 'Disabled'}`);
  console.log(`   Rate Limiting: ${result.config.RATE_LIMIT_ENABLED ? 'Enabled' : 'Disabled'}`);

  console.log('=' .repeat(50));
}

/**
 * Gets the validated configuration object
 * @returns Validated configuration
 */
export function getValidatedConfig(): Record<string, any> {
  const result = validateEnvironment();
  
  if (!result.valid) {
    console.error('❌ Environment validation failed. Please fix the errors above.');
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    printValidationResult(result);
  }

  return result.config;
}

/**
 * Generates a sample .env file with current schema
 * @param outputPath - Path to write the sample file
 */
export function generateEnvSample(outputPath: string = '.env.example'): void {
  let content = '# Rise-Task Backend Environment Configuration\n';
  content += '# Generated automatically - update as needed\n\n';

  const categories = {
    'Server Configuration': ['PORT', 'NODE_ENV'],
    'Database Configuration': ['MONGODB_URI', 'DB_MAX_POOL_SIZE', 'DB_SERVER_SELECTION_TIMEOUT', 'DB_SOCKET_TIMEOUT'],
    'Authentication & Security': ['JWT_SECRET', 'JWT_EXPIRES_IN', 'BCRYPT_ROUNDS'],
    'SSL/TLS Configuration': ['SSL_KEY_PATH', 'SSL_CERT_PATH', 'SSL_ENABLED'],
    'CORS Configuration': ['CORS_ORIGINS', 'CORS_CREDENTIALS'],
    'Logging Configuration': ['LOG_LEVEL', 'LOG_DIR'],
    'Notification Configuration': ['NOTIFICATION_ENABLED', 'NOTIFICATION_CHECK_INTERVAL'],
    'Rate Limiting': ['RATE_LIMIT_ENABLED', 'RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_REQUESTS']
  };

  for (const [category, keys] of Object.entries(categories)) {
    content += `# ${category}\n`;
    
    for (const key of keys) {
      const definition = ENV_SCHEMA.find(def => def.key === key);
      if (definition) {
        content += `# ${definition.description}\n`;
        const defaultValue = definition.default !== undefined ? definition.default : '';
        content += `${key}=${defaultValue}\n\n`;
      }
    }
  }

  fs.writeFileSync(outputPath, content);
  console.log(`📄 Environment sample file generated: ${outputPath}`);
}

// Export the validated configuration as default
export default getValidatedConfig();