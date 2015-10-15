module.exports = function () {
  'use strict';

  return {
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    // basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/sprintf/dist/sprintf.min.js',
      'bower_components/lodash/lodash.min.js',
      'bower_components/stacktrace-js/dist/stacktrace.min.js',
      'js/config.js',
      'js/core/accela.js',
      'js/**/module.js',
      'js/core/**/*.js',
      'js/automation/**/*.js',
      { pattern: 'mock-api/**/*.json', watched: true, served: true, included: false }
    ],

    preprocessors: {
      'js/**/*.js': 'coverage'
    },

    // list of files / patterns to exclude
    exclude: [
      'js/**/UNUSED/**/*.js'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    reporters: ['dots'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    colors: true
  };
};
