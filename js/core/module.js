/**
 * The HttpInterceptor and LoggingService.exceptionHandler
 * can be selectively disabled for debugging -- dbalmer@accela.com
 */
(function () {
  'use strict';

  angular
    .module('accela.core', [
      'ui.router'
    ])
    .constant('CONFIG', AccelaConfig);

  // ENABLE - HttpInterceptor and prevent caching

  angular
    .module('accela.core')
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('HttpInterceptor');
      $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    });

  // ENABLE - LoggingService.exceptionHandler

  angular
    .module('accela.core')
    .provider('$exceptionHandler', {
      // By default, AngularJS will catch errors and log them to the console.
      // We want to keep that behavior; however, we want to intercept it
      // so we can also log the errors to the server for later analysis.
      $get: function(LoggingService) {
        return LoggingService.exceptionHandler;
      }
    });
})();
