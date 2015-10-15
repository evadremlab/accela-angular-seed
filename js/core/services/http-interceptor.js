(function() {
  'use strict';

  angular
    .module('accela.core')
    .factory('HttpInterceptor', httpInterceptor);

  /**
   * @ngInject
   */
  function httpInterceptor($rootScope, $log, $q, LoggingService) {

    // PRIVATE data

    var requestsPending = 0;
    var isJson = /application\/json/i;
    var isExcluded = /\.htm*|\.js/i;

    // PRIVATE methods

    function isNotExcludedRequest(config) {
      var result = false;

      try {
        result = !isExcluded.test(config.url);
      } catch (ex) {
        $log.error($log.formatExceptionMessage(ex));
      }

      return result;
    }

    function showAjaxSpinner(config) {
      try {
        if (config && isNotExcludedRequest(config)) {
          requestsPending++;

          if (requestsPending === 1) {
            $rootScope.$broadcast('ajax.spinner', true);
          }
        }
      } catch (ex) {
        $log.error($log.formatExceptionMessage(ex));
      }
    }

    function hideAjaxSpinner(config) {
      try {
        if (config && isNotExcludedRequest(config)) {
          requestsPending--;
          if (requestsPending === 0) {
            $rootScope.$broadcast('ajax.spinner', false);
          }
        }
      } catch (ex) {
        $log.error($log.formatExceptionMessage(ex));
      }
    }

    function formatRejectedError(rejection) {
      var msg = '';

      try {
        if (rejection.fileName) {
          msg = rejection.message;
        } else {
          if (rejection.status && rejection.statusText) {
            msg = sprintf('%s %s - %s', rejection.status, rejection.statusText, rejection.config.url);
          } else if (rejection.config && rejection.config.url) {
            // ignore these -- may be caused by aborted ajax requests
          } else {
            msg = JSON.stringify(rejection);
          }
        }
      } catch (ex) {
        $log.error($log.formatExceptionMessage(ex));
      }

      return msg;
    }

    function rejected(rejection) {
      try {
        hideAjaxSpinner(rejection.config);

        rejection.customErrorMessage = formatRejectedError(rejection);

        if (rejection.customErrorMessage) {
          $log.warn(rejection.customErrorMessage);
          LoggingService.error(rejection.customErrorMessage);
        }
      } catch (ex) {
        $log.error($log.formatExceptionMessage(ex));
      }

      return $q.reject(rejection);
    }

    function request(config) {
      showAjaxSpinner(config);
      return config || $q.when(config);
    }

    function success(response) {
      var result = response;
      var responseHeaders = response.config.headers;

      try {
        hideAjaxSpinner(response.config);

        if (responseHeaders.AccelaSSO && responseHeaders.AccelaSSO === 'SessionTimeOut') {
          result = $q.reject('Your session has timed out.');
        } else if (isJson.test(responseHeaders['Content-Type'])) {
          var data = response.data || {};
          var status = data.status || 200;
          var message = data.message ? data.message.trim() : '';

          // Some API's return a "message" property,
          // so ignore any blank or 'SUCCESS' messages.

          if (!(message === '' || message === Accela.STATUS.SUCCESS)) {
            result = $q.reject(data.message);
          } else if (status !== 200) {
            result = $q.reject(sprintf('INVALID RESPONSE(%s): "%s"', status, data.message));
          }
        }
      } catch (ex) {
        result = $q.reject(sprintf('INVALID RESPONSE: "%s"', $log.formatExceptionMessage(ex)));
      }

      return result;
    }

    // INITIALIZE

    $log = $log.getInstance('HTTP-INTERCEPTOR');

    // PUBLIC interface

    return {
      request: request,
      requestError: rejected,
      responseError: rejected,
      response: success
    };
  }
})();
