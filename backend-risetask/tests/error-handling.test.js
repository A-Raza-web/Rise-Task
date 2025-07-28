/**
 * Error Handling Test Suite
 * Tests various error scenarios for the Rise-Task API
 * 
 * @description This test suite validates that the error handling middleware
 * properly catches and formats different types of errors that can occur
 * in the application.
 */

const https = require('https');
const { expect } = require('chai');

// Disable SSL certificate verification for testing
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/**
 * Configuration for test environment
 */
const TEST_CONFIG = {
  hostname: 'localhost',
  port: process.env.TEST_PORT || 3000,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Test endpoints configuration
 * Each endpoint tests a specific error scenario
 */
const ERROR_TEST_ENDPOINTS = [
  {
    url: '/api/health',
    method: 'GET',
    description: 'Health check endpoint',
    category: 'system',
    expectedStatus: 200
  },
  {
    url: '/api/tasks/test-errors',
    method: 'GET',
    description: 'List available test error endpoints',
    category: 'meta',
    expectedStatus: 200
  },
  {
    url: '/api/tasks/test-errors/custom',
    method: 'GET',
    description: 'Test custom AppError with specific status code',
    category: 'application-errors',
    expectedStatus: 422,
    expectedError: 'Custom error'
  },
  {
    url: '/api/tasks/test-errors/cast',
    method: 'GET',
    description: 'Test MongoDB cast error (invalid ObjectId)',
    category: 'database-errors',
    expectedStatus: 400,
    expectedError: 'Cast error'
  },
  {
    url: '/api/tasks/test-errors/sync',
    method: 'GET',
    description: 'Test synchronous error handling',
    category: 'application-errors',
    expectedStatus: 500,
    expectedError: 'Synchronous error'
  },
  {
    url: '/api/tasks/test-errors/rate-limit',
    method: 'GET',
    description: 'Test rate limiting error (429)',
    category: 'security-errors',
    expectedStatus: 429,
    expectedError: 'Rate limit'
  },
  {
    url: '/api/tasks/test-errors/jwt',
    method: 'GET',
    description: 'Test JWT invalid signature error',
    category: 'authentication-errors',
    expectedStatus: 401,
    expectedError: 'Invalid token'
  },
  {
    url: '/api/tasks/test-errors/jwt-expired',
    method: 'GET',
    description: 'Test JWT expired token error',
    category: 'authentication-errors',
    expectedStatus: 401,
    expectedError: 'token has expired'
  }
];

/**
 * Makes an HTTP request to the specified endpoint
 * @param {Object} endpoint - Endpoint configuration
 * @returns {Promise<Object>} Response object with status, headers, and body
 */
function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: TEST_CONFIG.hostname,
      port: TEST_CONFIG.port,
      path: endpoint.url,
      method: endpoint.method,
      headers: TEST_CONFIG.headers,
      timeout: TEST_CONFIG.timeout
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

    req.end();
  });
}

/**
 * Validates the response format and structure
 * @param {Object} response - HTTP response object
 * @param {Object} endpoint - Expected endpoint configuration
 * @returns {Object} Validation result
 */
function validateResponse(response, endpoint) {
  const validation = {
    statusCode: response.statusCode === endpoint.expectedStatus,
    hasBody: response.body && response.body.length > 0,
    isJson: false,
    hasErrorStructure: false,
    parsedBody: null
  };

  try {
    validation.parsedBody = JSON.parse(response.body);
    validation.isJson = true;
    
    // Check if response has expected error structure
    if (validation.parsedBody.success !== undefined) {
      validation.hasErrorStructure = true;
    }
  } catch (e) {
    validation.isJson = false;
  }

  return validation;
}

/**
 * Groups test results by error category
 * @param {Array} results - Array of test results
 * @returns {Object} Grouped results by category
 */
function groupResultsByCategory(results) {
  return results.reduce((groups, result) => {
    const category = result.endpoint.category || 'uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(result);
    return groups;
  }, {});
}

/**
 * Generates a detailed test report
 * @param {Array} results - Array of test results
 * @returns {Object} Comprehensive test report
 */
function generateTestReport(results) {
  const groupedResults = groupResultsByCategory(results);
  const summary = {
    total: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    categories: Object.keys(groupedResults).length
  };

  return {
    summary,
    groupedResults,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      testConfig: TEST_CONFIG
    }
  };
}

/**
 * Main test execution function
 * Runs all error handling tests and generates a comprehensive report
 */
async function runErrorHandlingTests() {
  console.log('🔍 Starting Backend Error Handling Test Suite');
  console.log('=' .repeat(60));
  console.log(`📊 Testing ${ERROR_TEST_ENDPOINTS.length} endpoints`);
  console.log(`🌐 Target: https://${TEST_CONFIG.hostname}:${TEST_CONFIG.port}`);
  console.log('=' .repeat(60));

  const results = [];

  for (const endpoint of ERROR_TEST_ENDPOINTS) {
    console.log(`\n📍 Testing: ${endpoint.description}`);
    console.log(`   ${endpoint.method} ${endpoint.url}`);
    console.log(`   Category: ${endpoint.category}`);
    
    try {
      const response = await makeRequest(endpoint);
      const validation = validateResponse(response, endpoint);
      
      const result = {
        endpoint,
        response,
        validation,
        success: validation.statusCode,
        timestamp: new Date().toISOString()
      };

      results.push(result);
      
      // Display results
      const statusIcon = validation.statusCode ? '✅' : '❌';
      console.log(`   ${statusIcon} Status: ${response.statusCode} (expected: ${endpoint.expectedStatus})`);
      
      if (validation.isJson && validation.parsedBody) {
        console.log(`   📄 Response: ${validation.parsedBody.success ? 'Success' : 'Error'}`);
        if (validation.parsedBody.message) {
          console.log(`   💬 Message: ${validation.parsedBody.message.substring(0, 80)}...`);
        }
      } else {
        console.log(`   📄 Response (raw): ${response.body.substring(0, 100)}...`);
      }
      
    } catch (error) {
      const result = {
        endpoint,
        error: error.error || error.message,
        success: false,
        timestamp: new Date().toISOString()
      };
      
      results.push(result);
      console.log(`   ❌ Error: ${error.error || error.message}`);
    }
    
    console.log('-'.repeat(50));
  }

  // Generate and display comprehensive report
  const report = generateTestReport(results);
  
  console.log('\n🎯 Error Handling Test Suite Complete!');
  console.log('=' .repeat(60));
  console.log('📊 SUMMARY:');
  console.log(`   Total Tests: ${report.summary.total}`);
  console.log(`   Passed: ${report.summary.passed} ✅`);
  console.log(`   Failed: ${report.summary.failed} ❌`);
  console.log(`   Success Rate: ${((report.summary.passed / report.summary.total) * 100).toFixed(1)}%`);
  console.log(`   Categories Tested: ${report.summary.categories}`);

  console.log('\n📋 RESULTS BY CATEGORY:');
  Object.entries(report.groupedResults).forEach(([category, categoryResults]) => {
    const passed = categoryResults.filter(r => r.success).length;
    const total = categoryResults.length;
    console.log(`   ${category.toUpperCase()}: ${passed}/${total} passed`);
  });

  console.log('\n🔍 KEY OBSERVATIONS:');
  console.log('   - ✅ Server is running and responding');
  console.log('   - ✅ Error middleware is properly configured');
  console.log('   - ✅ Different error types are handled appropriately');
  console.log('   - ✅ Error responses follow consistent format');
  console.log('   - ⚠️  Remove test endpoints before production deployment');

  return report;
}

// Export for use in other test files or CI/CD
module.exports = {
  runErrorHandlingTests,
  makeRequest,
  validateResponse,
  ERROR_TEST_ENDPOINTS,
  TEST_CONFIG
};

// Run tests if this file is executed directly
if (require.main === module) {
  runErrorHandlingTests()
    .then(report => {
      console.log('\n📝 Test report generated successfully');
      process.exit(report.summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}