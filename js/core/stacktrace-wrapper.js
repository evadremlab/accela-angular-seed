/**
 * requires stacktrace-js bower package, version 0.6.4
 */
(function() {
  'use strict';

  angular
    .module('accela.core')
    .factory('StacktraceService', function() {
      return {
        print: printStackTrace
      };
    });
})();
