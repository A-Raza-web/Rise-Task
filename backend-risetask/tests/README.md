# Rise-Task Backend Testing Suite

This directory contains a comprehensive testing suite for the Rise-Task backend API. The testing structure is organized to provide thorough coverage of all backend functionality with clear categorization and reporting.

## 📁 Directory Structure

```
tests/
├── README.md                    # This file - testing documentation
├── test.config.js              # Centralized test configuration
├── test-runner.js              # Main test orchestrator
├── error-handling.test.js      # Error handling and middleware tests
├── api.test.js                 # API integration tests
└── reports/                    # Generated test reports (auto-created)
    ├── latest-test-report.json
    └── test-report-[timestamp].json
```

## 🚀 Quick Start

### Running All Tests
```bash
# Run the complete test suite
node tests/test-runner.js

# Run with options
node tests/test-runner.js --no-reports --continue-on-failure
```

### Running Individual Test Suites
```bash
# Error handling tests only
node tests/error-handling.test.js

# API integration tests only
node tests/api.test.js
```

### Using npm Scripts (after package.json update)
```bash
npm test                    # Run all tests
npm run test:errors        # Run error handling tests
npm run test:api           # Run API integration tests
npm run test:watch         # Run tests in watch mode
```

## 📋 Test Categories

### 1. Error Handling Tests (`error-handling.test.js`)
Tests the error handling middleware and various error scenarios:

- **Application Errors**: Custom AppError handling
- **Database Errors**: MongoDB cast errors, validation errors
- **Authentication Errors**: JWT validation and expiration
- **Security Errors**: Rate limiting, unauthorized access
- **System Errors**: Synchronous and asynchronous error handling

**Endpoints Tested:**
- `/api/tasks/test-errors/custom` - Custom error handling
- `/api/tasks/test-errors/cast` - Database cast errors
- `/api/tasks/test-errors/sync` - Synchronous errors
- `/api/tasks/test-errors/rate-limit` - Rate limiting
- `/api/tasks/test-errors/jwt` - JWT errors
- `/api/tasks/test-errors/jwt-expired` - Token expiration

### 2. API Integration Tests (`api.test.js`)
Tests core API functionality and CRUD operations:

- **Health Check**: Server status and connectivity
- **Task Operations**: Create, read, update, delete tasks
- **Category Management**: Category listing and operations
- **Notifications**: Notification system functionality
- **Statistics**: Task and application statistics

**Endpoints Tested:**
- `/api/health` - Health check
- `/api/tasks` - Task CRUD operations
- `/api/tasks/stats` - Task statistics
- `/api/categories` - Category management
- `/api/notifications` - Notification system

## ⚙️ Configuration

### Environment Variables
```bash
# Server configuration
TEST_HOSTNAME=localhost
TEST_PORT=3000
TEST_PROTOCOL=https

# Test execution
TEST_TIMEOUT=10000
TEST_RETRIES=2
TEST_PARALLEL=false
TEST_VERBOSE=true

# SSL/TLS
NODE_TLS_REJECT_UNAUTHORIZED=0  # Disable for self-signed certs

# Reporting
TEST_REPORTS=true
TEST_INCLUDE_DETAILS=false
```

### Test Configuration (`test.config.js`)
Centralized configuration for all test settings:
- Server endpoints and ports
- Test data and fixtures
- Expected response structures
- Timeout and retry settings
- SSL/TLS configuration

## 📊 Test Reports

### Report Generation
- **JSON Reports**: Detailed machine-readable reports
- **Console Output**: Human-readable test results
- **Timestamps**: All reports include execution timestamps
- **Error Details**: Stack traces and error messages (in development)

### Report Location
- `tests/reports/latest-test-report.json` - Most recent test run
- `tests/reports/test-report-[timestamp].json` - Historical reports

### Report Structure
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "summary": {
    "totalSuites": 2,
    "passedSuites": 2,
    "failedSuites": 0,
    "totalTests": 15,
    "passedTests": 15,
    "failedTests": 0,
    "duration": 5432
  },
  "suites": [...],
  "environment": {...}
}
```

## 🔧 Test Runner Options

### Command Line Arguments
- `--no-reports` - Skip report generation
- `--continue-on-failure` - Don't exit on test failures
- `--quiet` - Reduce output verbosity
- `--help` - Show help message

### Programmatic Usage
```javascript
const { runAllTests, runTestSuite } = require('./test-runner');

// Run all tests
runAllTests().then(report => {
  console.log('Tests completed:', report.summary);
});

// Run specific suite
runTestSuite('error-handling', TEST_SUITES['error-handling'])
  .then(result => console.log('Suite result:', result));
```

## 🛠️ Development Guidelines

### Adding New Tests

1. **Create Test File**: Follow naming convention `[category].test.js`
2. **Update Test Runner**: Add suite to `TEST_SUITES` in `test-runner.js`
3. **Configure Endpoints**: Add endpoints to `test.config.js`
4. **Document Tests**: Update this README with new test descriptions

### Test Structure
```javascript
// Standard test function structure
async function runMyTests() {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const response = await makeRequest(testCase);
      const validation = validateResponse(response, testCase);
      results.push({ success: validation.passed, ...validation });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return { results, summary: generateSummary(results) };
}
```

### Best Practices
- **Isolation**: Each test should be independent
- **Cleanup**: Clean up test data after tests complete
- **Validation**: Validate both success and error responses
- **Documentation**: Document expected behavior and edge cases
- **Error Handling**: Gracefully handle network and server errors

## ⚠️ Important Notes

### Security Considerations
- **Test Endpoints**: Remove `/api/tasks/test-errors/*` endpoints before production
- **SSL Certificates**: Tests disable SSL verification for self-signed certificates
- **Test Data**: Ensure test data doesn't contain sensitive information

### Production Deployment
Before deploying to production:
1. Remove all test error endpoints from routes
2. Remove test error functions from controllers
3. Enable SSL certificate validation
4. Update environment variables for production

### Troubleshooting

#### Common Issues
1. **Connection Refused**: Ensure the server is running on the correct port
2. **SSL Errors**: Check `NODE_TLS_REJECT_UNAUTHORIZED` setting
3. **Timeout Errors**: Increase `TEST_TIMEOUT` for slow environments
4. **Database Errors**: Verify MongoDB connection and test database access

#### Debug Mode
```bash
# Enable verbose logging
TEST_VERBOSE=true node tests/test-runner.js

# Include request/response details in reports
TEST_INCLUDE_DETAILS=true node tests/test-runner.js
```

## 📈 Future Enhancements

### Planned Features
- **Unit Tests**: Add unit tests for individual functions
- **Performance Tests**: Load testing and performance benchmarks
- **Authentication Tests**: User authentication and authorization
- **Database Tests**: Direct database operation testing
- **Mock Services**: Mock external service dependencies
- **CI/CD Integration**: GitHub Actions workflow integration

### Test Coverage Goals
- **API Endpoints**: 100% endpoint coverage
- **Error Scenarios**: All error types and edge cases
- **Business Logic**: Core functionality validation
- **Performance**: Response time and throughput testing

## 📞 Support

For questions or issues with the testing suite:
1. Check this README for common solutions
2. Review test configuration in `test.config.js`
3. Examine test reports for detailed error information
4. Ensure server is running and accessible

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Rise-Task Development Team