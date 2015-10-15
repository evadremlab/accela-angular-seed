/**
 * you have to run "webdriver-manager start" before testing
 */
module.exports = {
  e2e: {
    options: {
      keepAlive: true,
      configFile: "protractor.conf.js"
    },
    singlerun: {},
    auto: {
      keepAlive: true,
      options: {
        args: {
          seleniumPort: 4444
        }
      }
    }
  }
};