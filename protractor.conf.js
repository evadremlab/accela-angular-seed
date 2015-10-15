/**
 * you have to run "webdriver-manager start" before testing
 */
exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./tests/e2e/BrowserTests.js']
};