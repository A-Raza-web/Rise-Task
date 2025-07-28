/**
 * Test Runner for Rise-Task Backend
 * Orchestrates and runs all test suites with comprehensive reporting
 * 
 * @description This is the main test runner that executes all test suites
 * and generates consolidated reports for the entire backend application.
 */

const fs = require('fs');
const path = require('path');
const { runErrorHandlingTests } = require('./error-handling.test');
const { runApiTests } = require('./api.test');

/**
 * Test runner configuration
 */
const TEST_RUNNER_CONFIG = {
  outputDir: path.join(__dirname, 'reports'),
  generateReports: true,
  exitOnFailure: true,
  verbose: true,
  timeout: 30000 // 30 seconds total timeout
};

/**
 * Available test suites
 */
const TEST_SUITES = {
  'error-handling': {
    name: 'Error Handling Tests',
    description: 'Tests error handling middleware and error scenarios',
    runner: runErrorHandlingTests,
    enabled: true
  },
  'api-integration': {
    name: 'API Integration Tests',
    description: 'Tests core API functionality and endpoints',
    runner: runApiTests,
    enabled: true
  }
};

/**
 * Creates the reports directory if it doesn't exist
 */
function ensureReportsDirectory() {
  if (!fs.existsSync(TEST_RUNNER_CONFIG.outputDir)) {
    fs.mkdirSync(TEST_RUNNER_CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created reports directory: ${TEST_RUNNER_CONFIG.outputDir}`);
  }
}

/**
 * Generates a consolidated test report
 * @param {Array} suiteResults - Results from all test suites
 * @returns {Object} Consolidated report
 */
function generateConsolidatedReport(suiteResults) {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd()
    },
    summary: {
      totalSuites: suiteResults.length,
      passedSuites: suiteResults.filter(s => s.success).length,
      failedSuites: suiteResults.filter(s => !s.success).length,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: 0
    },
    suites: suiteResults
  };

  // Calculate totals
  suiteResults.forEach(suite => {
    if (suite.results) {
      if (suite.results.summary) {
        report.summary.totalTests += suite.results.summary.total || 0;
        report.summary.passedTests += suite.results.summary.passed || 0;
        report.summary.failedTests += suite.results.summary.failed || 0;
      } else if (Array.isArray(suite.results.results)) {
        report.summary.totalTests += suite.results.results.length;
        report.summary.passedTests += suite.results.results.filter(r => r.success).length;
        report.summary.failedTests += suite.results.results.filter(r => !r.success).length;
      }
    }
    report.summary.duration += suite.duration || 0;
  });

  return report;
}

/**
 * Saves report to file
 * @param {Object} report - Test report to save
 * @param {string} filename - Output filename
 */
function saveReport(report, filename) {
  if (!TEST_RUNNER_CONFIG.generateReports) return;

  try {
    const reportPath = path.join(TEST_RUNNER_CONFIG.outputDir, filename);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved: ${reportPath}`);
  } catch (error) {
    console.error(`❌ Failed to save report: ${error.message}`);
  }
}

/**
 * Displays a formatted summary of test results
 * @param {Object} report - Consolidated test report
 */
function displaySummary(report) {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 RISE-TASK BACKEND TEST SUITE SUMMARY');
  console.log('='.repeat(80));
  
  console.log('\n📊 OVERALL RESULTS:');
  console.log(`   Total Test Suites: ${report.summary.totalSuites}`);
  console.log(`   Passed Suites: ${report.summary.passedSuites} ✅`);
  console.log(`   Failed Suites: ${report.summary.failedSuites} ❌`);
  console.log(`   Total Tests: ${report.summary.totalTests}`);
  console.log(`   Passed Tests: ${report.summary.passedTests} ✅`);
  console.log(`   Failed Tests: ${report.summary.failedTests} ❌`);
  console.log(`   Success Rate: ${((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1)}%`);
  console.log(`   Total Duration: ${(report.summary.duration / 1000).toFixed(2)}s`);

  console.log('\n📋 SUITE BREAKDOWN:');
  report.suites.forEach(suite => {
    const icon = suite.success ? '✅' : '❌';
    const duration = suite.duration ? `(${(suite.duration / 1000).toFixed(2)}s)` : '';
    console.log(`   ${icon} ${suite.name} ${duration}`);
    if (suite.error) {
      console.log(`      Error: ${suite.error}`);
    }
  });

  console.log('\n🔍 RECOMMENDATIONS:');
  if (report.summary.failedTests > 0) {
    console.log('   - ⚠️  Review failed tests and fix underlying issues');
    console.log('   - 🔧 Check server configuration and database connectivity');
    console.log('   - 📝 Update test expectations if API behavior has changed');
  } else {
    console.log('   - ✅ All tests passed! Backend is functioning correctly');
    console.log('   - 🚀 Ready for deployment');
  }

  console.log('\n⚠️  IMPORTANT NOTES:');
  console.log('   - Remove test error endpoints before production deployment');
  console.log('   - Ensure proper environment variables are set');
  console.log('   - Run tests in CI/CD pipeline before deployment');
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Runs a single test suite with error handling and timing
 * @param {string} suiteKey - Key of the test suite to run
 * @param {Object} suite - Test suite configuration
 * @returns {Promise<Object>} Suite result
 */
async function runTestSuite(suiteKey, suite) {
  const startTime = Date.now();
  
  console.log(`\n🚀 Running ${suite.name}...`);
  console.log(`📝 ${suite.description}`);
  console.log('-'.repeat(60));

  try {
    const results = await Promise.race([
      suite.runner(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test suite timeout')), TEST_RUNNER_CONFIG.timeout)
      )
    ]);

    const duration = Date.now() - startTime;
    
    return {
      key: suiteKey,
      name: suite.name,
      description: suite.description,
      success: true,
      results,
      duration,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`❌ ${suite.name} failed:`, error.message);
    
    return {
      key: suiteKey,
      name: suite.name,
      description: suite.description,
      success: false,
      error: error.message,
      duration,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Main test runner function
 * Executes all enabled test suites and generates reports
 */
async function runAllTests() {
  console.log('🎯 Rise-Task Backend Test Suite Runner');
  console.log('='.repeat(80));
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌐 Node.js: ${process.version}`);
  console.log(`💻 Platform: ${process.platform}`);
  console.log('='.repeat(80));

  // Ensure reports directory exists
  ensureReportsDirectory();

  const suiteResults = [];
  const enabledSuites = Object.entries(TEST_SUITES).filter(([_, suite]) => suite.enabled);

  console.log(`\n📋 Running ${enabledSuites.length} test suites...`);

  // Run each test suite
  for (const [suiteKey, suite] of enabledSuites) {
    const result = await runTestSuite(suiteKey, suite);
    suiteResults.push(result);
  }

  // Generate consolidated report
  const consolidatedReport = generateConsolidatedReport(suiteResults);
  
  // Save reports
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  saveReport(consolidatedReport, `test-report-${timestamp}.json`);
  saveReport(consolidatedReport, 'latest-test-report.json');

  // Display summary
  displaySummary(consolidatedReport);

  // Exit with appropriate code
  const hasFailures = consolidatedReport.summary.failedTests > 0 || consolidatedReport.summary.failedSuites > 0;
  
  if (hasFailures && TEST_RUNNER_CONFIG.exitOnFailure) {
    console.log('\n💥 Tests failed - exiting with error code 1');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests completed successfully!');
    process.exit(0);
  }
}

/**
 * CLI argument parsing
 */
function parseArguments() {
  const args = process.argv.slice(2);
  
  args.forEach(arg => {
    switch (arg) {
      case '--no-reports':
        TEST_RUNNER_CONFIG.generateReports = false;
        break;
      case '--continue-on-failure':
        TEST_RUNNER_CONFIG.exitOnFailure = false;
        break;
      case '--quiet':
        TEST_RUNNER_CONFIG.verbose = false;
        break;
      case '--help':
        console.log(`
Rise-Task Backend Test Runner

Usage: node test-runner.js [options]

Options:
  --no-reports           Don't generate test reports
  --continue-on-failure  Don't exit on test failures
  --quiet               Reduce output verbosity
  --help                Show this help message

Available Test Suites:
${Object.entries(TEST_SUITES).map(([key, suite]) => 
  `  ${key.padEnd(20)} ${suite.description}`
).join('\n')}
        `);
        process.exit(0);
        break;
    }
  });
}

// Export for programmatic use
module.exports = {
  runAllTests,
  runTestSuite,
  TEST_SUITES,
  TEST_RUNNER_CONFIG
};

// Run if executed directly
if (require.main === module) {
  parseArguments();
  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}