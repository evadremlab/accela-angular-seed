(function() {
  'use strict';

  angular
    .module('accela.core')
    .config(function ($provide, CONFIG) {
      $provide.decorator('$log', function ($delegate) {
        return enhancedConsoleLogger($delegate, CONFIG);
      });
    })
    .factory('LoggingService', service);

  /**
   * @ngInject
   */
  function service($injector, $log, $window, StacktraceService, CONFIG) {

    // PRIVATE methods

    function criticalHandler(msg) {
      sendToServer('Critical', msg);
    }

    function debugHandler(msg) {
      sendToServer('Debug', msg);
    }

    function errorHandler(msg) {
      rootScope().$broadcast('dashboard.addAlert', { // handled in AutomationController
        type: 'danger', msg: msg
      });

      sendToServer('Error', msg);
    }

    function exceptionHandler(ex, cause) {
      try {
        var formattedMsg = formatExceptionMessage(ex);
        var stackTrace = StacktraceService.print({ e: ex });

        rootScope().$broadcast('error.alert', { // handled in AutomationController
          type: 'danger', msg: formattedMsg + ' : ' + stackTrace
        });

        sendToServer('Critical', formattedMsg, stackTrace, cause);
      } catch (ex) {
        if (console && console.error) {
          console.error('Error logging failed : "%s" : %s'.format(ex.message, ex.stack || ''));
        }
      }
    }

    function formatExceptionMessage(ex) {
      if (ex.fileName) {
        return '%s in %s at line %s, column %s'.format(ex.toString(), ex.fileName, ex.lineNumber, ex.columnNumber);
      } else {
        return ex.toString();
      }
    }

    function infoHandler(msg) {
      sendToServer('Info', msg);
    }

    function rootScope() {
      var scope = $injector.get('$rootScope');

      if (!scope) {
        $log.error('unable to get $rootScope');

        scope = { // create mock method to prevent errors
          $broadcast: function(event, obj) {
            $log.error(event + ' ' + JSON.stringify(obj));
          }
        };
      }

      return scope;
    }

    function sendToServer(logLevel, message, stacktrace, cause) {
      if (CONFIG.LOG_CLIENT_ERRORS) {
        writeLog({
          logLevel: logLevel || 'Info',
          message: message || '',
          stacktrace: stacktrace || '',
          cause: cause || ''
        });
      }
    }

    function warnHandler(msg) {
      sendToServer('Warn', msg);
    }

    /**
     * Using XMLHttpRequest instead of $http to avoid circular dependencies.
     */
    function writeLog(logData) {
      if (!CONFIG.USE_MOCK_SERVICES) {
        angular.extend(logData, {
          url: $window.location.href
        });

        Accela.XHR.post(CONFIG.LOG_URL, logData, CONFIG.LOG_ACCESS_KEY);
      }
    }

    // INITIALIZE

    $log = $log.getInstance('LOGGING-SERVICE');

    // PUBLIC interface

    return {
      critical: criticalHandler,
      debug: debugHandler,
      error: errorHandler,
      exceptionHandler: _.debounce(exceptionHandler, 500),
      formatExceptionMessage:  formatExceptionMessage,
      info: infoHandler,
      warn: warnHandler
    };
  }

  /**
   * Add prefix to $log messages for debugging.
   *
   * SEE: http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/
   */
  function enhancedConsoleLogger(log, config) {
    var logEnabled = config.CONSOLE_LOGGING_ENABLED;

    var _$log = { // capture the original methods
      log   : (logEnabled ? log.log : angular.noop),
      info  : (logEnabled ? log.info : angular.noop),
      debug : (logEnabled ? log.debug : angular.noop),
      warn  : log.warn,
      error : log.error
    };

    function prepareLogFn(logFn, prefix) {

      var enhancedLogFn = function() {
        var args = [].slice.call(arguments);

        if (prefix) { // prepend an optional prefix to the original message
          args[0] = prefix + ' : ' + args[0];
        }

        logFn.apply(null, args); // invoke $log method with our prefixed message
      };

      enhancedLogFn.logs = []; // add support for angular-mocks expectations

      return enhancedLogFn;
    }

    // add a new $log method returning an extended $log

    log.getInstance = function(prefix) {
      var logInstance = {
        log: prepareLogFn(_$log.log, prefix),
        info: prepareLogFn(_$log.info, prefix),
        debug: prepareLogFn(_$log.debug, prefix),
        warn: prepareLogFn(_$log.warn, prefix),
        error: prepareLogFn(_$log.error, prefix),
        format: function(msg) {
          return prefix + ' : ' + msg;
        }
      };

      logInstance.ts = function(msg) { // prefix with a timestamp
        logInstance.debug(new Date().getTime() + ' - ' + msg);
      };

      logInstance.debug('created');

      return logInstance;
    };

    return log;
  }
})();
