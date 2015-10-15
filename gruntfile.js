'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  function loadTaskOptions(path) {
    var glob = require('glob'),
      taskOptions = {},
      key;

    glob.sync('*', {cwd: path}).forEach(function (option) {
      key = option.replace(/\.js$/, '');
      taskOptions[key] = require(path + option);
    });

    return taskOptions;
  }

  // load options automatically
  grunt.initConfig(loadTaskOptions('./build/tasks/'));

  grunt.registerTask('default', [
    'jshint:app',
    'wiredep:app',
    'less:css'
  ]);
};
