/**
 * API Integration Test Suite
 * Tests core API functionality for the Rise-Task application
 * 
 * @description This test suite validates the main API endpoints
 * including CRUD operations for tasks, categories, and notifications.
 */

const https = require('https');
const { expect } = require('chai');

// Disable SSL certificate verification for testing
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/**
 * Test configuration
 */
const API_TEST_CONFIG = {
  hostname: 'localhost',
  port: process.env.TEST_PORT || 3000,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * API test endpoints organized by functionality
 */
const API_ENDPOINTS = {
  health: {
    url: '/api/health',
    method: 'GET',
    description: 'Health check endpoint',
    expectedStatus: 200
  },
  tasks: {
    list: {
      url: '/api/tasks',
      method: 'GET',
      description: 'Get all tasks',
      expectedStatus: 200
    },
    create: {
      url: '/api/tasks',
      method: 'POST',
      description: 'Create new task',
      expectedStatus: 201,
      payload: {
        title: 'Test Task',
        description: 'This is a test task for API validation',
        priority: 'medium',
        category: 'General',
        tags: ['test', 'api']
      }
    },
    stats: {
      url: '/api/tasks/stats',
      method: 'GET',
      description: 'Get task statistics',
      expectedStatus: 200
    }
  },
  categories: {
    list: {
      url: '/api/categories',
      method: 'GET',
      description: 'Get all categories',
      expectedStatus: 200
    }
  },
  notifications: {
    list: {
      url: '/api/notifications',
      method: 'GET',
      description: 'Get all notifications',
      expectedStatus: 200
    }
  },
  stats: {
    overview: {
      url: '/api/stats',
      method: 'GET',
      description: 'Get application statistics',
      expectedStatus: 200
    }
  }
};

/**
 * Makes an HTTP request with optional payload
 * @param {Object} endpoint - Endpoint configuration
 * @param {Object} payload - Optional request payload
 * @returns {Promise<Object>} Response object
 */
function makeApiRequest(endpoint, payload = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_TEST_CONFIG.hostname,
      port: API_TEST_CONFIG.port,
      path: endpoint.url,
      method: endpoint.method,
      headers: { ...API_TEST_CONFIG.headers },
      timeout: API_TEST_CONFIG.timeout
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          endpoint: endpoint
        });
      });
    });

    req.on('error', (error) => {
      reject({ 
        error: error.message, 
        endpoint: endpoint.description,
        code: error.code 
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ 
        error: 'Request timeout', 
        endpoint: endpoint.description 
      });
    });

    // Send payload if provided
    if (payload && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
      req.write(JSON.stringify(payload));
    }

    req.end();
  });
}

/**
 * Validates API response structure
 * @param {Object} response - HTTP response
 * @param {Object} endpoint - Expected endpoint configuration
 * @returns {Object} Validation result
 */
function validateApiResponse(response, endpoint) {
  const validation = {
    statusCode: response.statusCode === endpoint.expectedStatus,
    hasBody: response.body && response.body.length > 0,
    isJson: false,
    hasValidStructure: false,
    parsedBody: null,
    errors: []
  };

  try {
    validation.parsedBody = JSON.parse(response.body);
    validation.isJson = true;
    
    // Check for standard API response structure
    if (validation.parsedBody.success !== undefined) {
      validation.hasValidStructure = true;
      
      // Additional validations based on endpoint type
      if (endpoint.url.includes('/tasks') && validation.parsedBody.success) {
        if (endpoint.method === 'GET' && !validation.parsedBody.data) {
          validation.errors.push('Missing data field in successful response');
        }
      }
    }
  } catch (e) {
    validation.isJson = false;
    validation.errors.push('Response is not valid JSON');
  }

  return validation;
}

/**
 * Runs comprehensive API tests
 */
async function runApiTests() {
  console.log('🚀 Starting API Integration Test Suite');
  console.log('=' .repeat(60));
  console.log(`🌐 Target: https://${API_TEST_CONFIG.hostname}:${API_TEST_CONFIG.port}`);
  console.log('=' .repeat(60));

  const results = [];
  let createdTaskId = null;

  // Test Health Check
  console.log('\n🏥 Testing Health Check...');
  try {
    const healthResponse = await makeApiRequest(API_ENDPOINTS.health);
    const validation = validateApiResponse(healthResponse, API_ENDPOINTS.health);
    
    results.push({
      category: 'health',
      endpoint: API_ENDPOINTS.health,
      response: healthResponse,
      validation,
      success: validation.statusCode && validation.isJson
    });

    console.log(`   ${validation.statusCode ? '✅' : '❌'} Health Check: ${healthResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ Health Check Failed: ${error.error}`);
    results.push({
      category: 'health',
      endpoint: API_ENDPOINTS.health,
      error: error.error,
      success: false
    });
  }

  // Test Task Operations
  console.log('\n📋 Testing Task Operations...');
  
  // Get all tasks
  try {
    const tasksResponse = await makeApiRequest(API_ENDPOINTS.tasks.list);
    const validation = validateApiResponse(tasksResponse, API_ENDPOINTS.tasks.list);
    
    results.push({
      category: 'tasks',
      endpoint: API_ENDPOINTS.tasks.list,
      response: tasksResponse,
      validation,
      success: validation.statusCode && validation.isJson
    });

    console.log(`   ${validation.statusCode ? '✅' : '❌'} Get Tasks: ${tasksResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ Get Tasks Failed: ${error.error}`);
  }

  // Create a task
  try {
    const createResponse = await makeApiRequest(API_ENDPOINTS.tasks.create, API_ENDPOINTS.tasks.create.payload);
    const validation = validateApiResponse(createResponse, API_ENDPOINTS.tasks.create);
    
    if (validation.parsedBody && validation.parsedBody.data && validation.parsedBody.data._id) {
      createdTaskId = validation.parsedBody.data._id;
    }

    results.push({
      category: 'tasks',
      endpoint: API_ENDPOINTS.tasks.create,
      response: createResponse,
      validation,
      success: validation.statusCode && validation.isJson
    });

    console.log(`   ${validation.statusCode ? '✅' : '❌'} Create Task: ${createResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ Create Task Failed: ${error.error}`);
  }

  // Get task statistics
  try {
    const statsResponse = await makeApiRequest(API_ENDPOINTS.tasks.stats);
    const validation = validateApiResponse(statsResponse, API_ENDPOINTS.tasks.stats);
    
    results.push({
      category: 'tasks',
      endpoint: API_ENDPOINTS.tasks.stats,
      response: statsResponse,
      validation,
      success: validation.statusCode && validation.isJson
    });

    console.log(`   ${validation.statusCode ? '✅' : '❌'} Task Stats: ${statsResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ Task Stats Failed: ${error.error}`);
  }

  // Test Categories
  console.log('\n📁 Testing Categories...');
  try {
    const categoriesResponse = await makeApiRequest(API_ENDPOINTS.categories.list);
    const validation = validateApiResponse(categoriesResponse, API_ENDPOINTS.categories.list);
    
    results.push({
      category: 'categories',
      endpoint: API_ENDPOINTS.categories.list,
      response: categoriesResponse,
      validation,
      success: validation.statusCode && validation.isJson
    });

    console.log(`   ${validation.statusCode ? '✅' : '❌'} Get Categories: ${categoriesResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ Get Categories Failed: ${error.error}`);
  }

  // Test Notifications
  console.log('\n🔔 Testing Notifications...');
  try {
    const notificationsResponse = await makeApiRequest(API_ENDPOINTS.notifications.list);
    const validation = validateApiResponse(notificationsResponse, API_ENDPOINTS.notifications.list);
    
    results.push({
      category: 'notifications',
      endpoint: API_ENDPOINTS.notifications.list,
      response: notificationsResponse,
      validation,
      success: validation.statusCode && validation.isJson
    });

    console.log(`   ${validation.statusCode ? '✅' : '❌'} Get Notifications: ${notificationsResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ Get Notifications Failed: ${error.error}`);
  }

  // Generate Summary
  const summary = {
    total: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    categories: [...new Set(results.map(r => r.category))].length
  };

  console.log('\n🎯 API Integration Tests Complete!');
  console.log('=' .repeat(60));
  console.log('📊 SUMMARY:');
  console.log(`   Total Tests: ${summary.total}`);
  console.log(`   Passed: ${summary.passed} ✅`);
  console.log(`   Failed: ${summary.failed} ❌`);
  console.log(`   Success Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%`);

  // Cleanup: Delete created task if it exists
  if (createdTaskId) {
    console.log('\n🧹 Cleaning up test data...');
    try {
      await makeApiRequest({
        url: `/api/tasks/${createdTaskId}`,
        method: 'DELETE',
        description: 'Delete test task',
        expectedStatus: 200
      });
      console.log('   ✅ Test task deleted successfully');
    } catch (error) {
      console.log('   ⚠️  Could not delete test task:', error.error);
    }
  }

  return { results, summary };
}

// Export for use in other test files
module.exports = {
  runApiTests,
  makeApiRequest,
  validateApiResponse,
  API_ENDPOINTS,
  API_TEST_CONFIG
};

// Run tests if this file is executed directly
if (require.main === module) {
  runApiTests()
    .then(({ summary }) => {
      console.log('\n📝 API test report generated successfully');
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 API test suite failed:', error);
      process.exit(1);
    });
}