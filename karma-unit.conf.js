var sharedConfig = require('./karma-shared.conf');

module.exports = function (config) {
  'use strict';

  var conf = sharedConfig();

  conf.files = conf.files.concat([
    './tests/unit/core/*.js'
  ]);

  config.set(conf);
};
