/**
 * Test Configuration for Rise-Task Backend
 * Centralized configuration for all test suites
 * 
 * @description This file contains all configuration settings for the test environment,
 * including server settings, timeouts, and test data.
 */

const path = require('path');

/**
 * Environment-specific configuration
 */
const environments = {
  development: {
    hostname: 'localhost',
    port: 3000,
    protocol: 'https',
    database: 'RiseTaskDB_test'
  },
  testing: {
    hostname: 'localhost',
    port: 3001,
    protocol: 'https',
    database: 'RiseTaskDB_test'
  },
  staging: {
    hostname: 'staging.risetask.com',
    port: 443,
    protocol: 'https',
    database: 'RiseTaskDB_staging'
  }
};

/**
 * Current environment (can be overridden by NODE_ENV)
 */
const currentEnv = process.env.NODE_ENV || 'development';
const config = environments[currentEnv] || environments.development;

/**
 * Test configuration object
 */
const testConfig = {
  // Environment settings
  environment: currentEnv,
  server: {
    hostname: process.env.TEST_HOSTNAME || config.hostname,
    port: parseInt(process.env.TEST_PORT || config.port, 10),
    protocol: process.env.TEST_PROTOCOL || config.protocol,
    baseUrl: `${config.protocol}://${config.hostname}:${config.port}`
  },

  // Test execution settings
  execution: {
    timeout: parseInt(process.env.TEST_TIMEOUT || '10000', 10), // 10 seconds default
    retries: parseInt(process.env.TEST_RETRIES || '2', 10),
    parallel: process.env.TEST_PARALLEL === 'true',
    verbose: process.env.TEST_VERBOSE !== 'false',
    exitOnFailure: process.env.TEST_EXIT_ON_FAILURE !== 'false'
  },

  // SSL/TLS settings for testing
  ssl: {
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
    selfSigned: true // Allow self-signed certificates in test environment
  },

  // Test data and fixtures
  testData: {
    validTask: {
      title: 'Test Task for API Validation',
      description: 'This is a comprehensive test task used for API endpoint validation and testing',
      priority: 'medium',
      category: 'General',
      tags: ['test', 'api', 'validation'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notifications: {
        enabled: true,
        reminderTime: 24
      }
    },
    invalidTask: {
      title: '', // Invalid: empty title
      description: 'Short', // Invalid: too short
      priority: 'invalid', // Invalid: not in enum
      category: '',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Invalid: past date
    },
    validCategory: {
      name: 'Test Category',
      description: 'A test category for validation',
      color: '#FF5733',
      icon: 'test-icon'
    }
  },

  // Expected API response structures
  expectedStructures: {
    successResponse: {
      success: true,
      message: 'string',
      data: 'object|array'
    },
    errorResponse: {
      success: false,
      message: 'string',
      error: 'string|object'
    },
    paginatedResponse: {
      success: true,
      data: 'array',
      pagination: {
        currentPage: 'number',
        totalPages: 'number',
        totalTasks: 'number',
        hasNextPage: 'boolean',
        hasPrevPage: 'boolean'
      }
    }
  },

  // Test endpoints organized by category
  endpoints: {
    health: '/api/health',
    tasks: {
      base: '/api/tasks',
      create: '/api/tasks',
      list: '/api/tasks',
      stats: '/api/tasks/stats',
      bulk: {
        update: '/api/tasks/bulk/update',
        delete: '/api/tasks/bulk/delete'
      },
      testErrors: {
        base: '/api/tasks/test-errors',
        custom: '/api/tasks/test-errors/custom',
        validation: '/api/tasks/test-errors/validation',
        cast: '/api/tasks/test-errors/cast',
        sync: '/api/tasks/test-errors/sync',
        rateLimit: '/api/tasks/test-errors/rate-limit',
        jwt: '/api/tasks/test-errors/jwt',
        jwtExpired: '/api/tasks/test-errors/jwt-expired'
      }
    },
    categories: {
      base: '/api/categories',
      list: '/api/categories'
    },
    notifications: {
      base: '/api/notifications',
      list: '/api/notifications'
    },
    stats: {
      overview: '/api/stats'
    }
  },

  // HTTP status codes for validation
  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },

  // Test categories for organization
  testCategories: {
    HEALTH: 'health',
    API_INTEGRATION: 'api-integration',
    ERROR_HANDLING: 'error-handling',
    AUTHENTICATION: 'authentication',
    VALIDATION: 'validation',
    PERFORMANCE: 'performance',
    SECURITY: 'security'
  },

  // Reporting configuration
  reporting: {
    enabled: process.env.TEST_REPORTS !== 'false',
    outputDir: path.join(__dirname, 'reports'),
    formats: ['json', 'html'], // Future: support multiple formats
    includeStackTrace: currentEnv === 'development',
    includeRequestResponse: process.env.TEST_INCLUDE_DETAILS === 'true'
  },

  // Database configuration for tests
  database: {
    testDatabase: config.database,
    cleanupAfterTests: process.env.TEST_CLEANUP !== 'false',
    seedData: process.env.TEST_SEED_DATA === 'true'
  },

  // Headers for API requests
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'RiseTask-Test-Suite/1.0'
  },

  // Authentication settings (for future use)
  auth: {
    testUser: {
      username: 'testuser',
      email: 'test@risetask.com',
      password: 'testpassword123'
    },
    jwtSecret: process.env.JWT_SECRET || 'test_jwt_secret_key'
  }
};

/**
 * Validates the test configuration
 * @returns {Object} Validation result
 */
function validateConfig() {
  const errors = [];
  const warnings = [];

  // Check required settings
  if (!testConfig.server.hostname) {
    errors.push('Server hostname is required');
  }

  if (!testConfig.server.port || testConfig.server.port < 1 || testConfig.server.port > 65535) {
    errors.push('Valid server port is required (1-65535)');
  }

  if (testConfig.execution.timeout < 1000) {
    warnings.push('Test timeout is very low (< 1 second)');
  }

  // Check SSL settings
  if (!testConfig.ssl.rejectUnauthorized) {
    warnings.push('SSL certificate validation is disabled - only use in test environments');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Gets configuration for a specific test category
 * @param {string} category - Test category
 * @returns {Object} Category-specific configuration
 */
function getConfigForCategory(category) {
  const baseConfig = { ...testConfig };
  
  switch (category) {
    case testConfig.testCategories.PERFORMANCE:
      baseConfig.execution.timeout = 30000; // Longer timeout for performance tests
      break;
    case testConfig.testCategories.ERROR_HANDLING:
      baseConfig.execution.retries = 0; // No retries for error tests
      break;
    default:
      break;
  }

  return baseConfig;
}

/**
 * Prints configuration summary
 */
function printConfigSummary() {
  console.log('🔧 Test Configuration Summary:');
  console.log(`   Environment: ${testConfig.environment}`);
  console.log(`   Server: ${testConfig.server.baseUrl}`);
  console.log(`   Timeout: ${testConfig.execution.timeout}ms`);
  console.log(`   Retries: ${testConfig.execution.retries}`);
  console.log(`   Reports: ${testConfig.reporting.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   SSL Validation: ${testConfig.ssl.rejectUnauthorized ? 'Enabled' : 'Disabled'}`);
}

module.exports = {
  testConfig,
  validateConfig,
  getConfigForCategory,
  printConfigSummary,
  environments
};