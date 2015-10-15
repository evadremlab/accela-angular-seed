(function () {
  'use strict';

  angular
    .module('accela.core')
    .factory('DataService', service);

  /**
   * @ngInject
   */
  function service($http, $log, CONFIG) {

    // PRIVATE methods

    function getInstance(instanceName) {
      var service = CONFIG.SERVICES[instanceName];

      function getServiceMethod(methodName) {
        var serviceMethod = service[methodName];

        if (serviceMethod) {
          serviceMethod.name = methodName; // used for error messages
        } else {
          throw new Error(sprintf('CONFIG.SERVICES.%s.%s is not defined', instanceName, methodName));
        }

        return serviceMethod;
      }

      if (service) {
        //
        // return INSTANCE interface
        //
        return {
          send: function(methodName, data, params) {
            return makeRequest(getServiceMethod(methodName), data, params);
          },
          getServiceUrl: function(methodName) {
            return getServiceUrl(getServiceMethod(methodName));
          },
          isUsingMockData: CONFIG.USE_MOCK_SERVICES ? true : false
        };
      } else {
        throw new Error(sprintf('CONFIG.SERVICES.%s is undefined', instanceName));
      }
    }

    /**
     * Construct serviceMethod url from configuration.
     * Also used by unit tests for mocking http responses.
     */
    function getServiceUrl(serviceMethod) {
      var serviceUrl;

      if (CONFIG.USE_MOCK_SERVICES || serviceMethod.notImplemented) {
        if (serviceMethod.mockEndPoint) {
          serviceUrl = serviceMethod.mockEndPoint;
        } else {
          throw new Error('mockEndPoint undefined for ' + serviceMethod.name);
        }
      } else {
        serviceUrl = CONFIG.API_URL + serviceMethod.endPoint;
      }

      return serviceUrl;
    }

    /**
     * If httpMethod is GET, any "data" WILL NOT BE SENT.
     */
    function makeRequest(serviceMethod, data, params) {
      return $http({
        method: serviceMethod.httpMethod || 'GET',
        url: getServiceUrl(serviceMethod),
        data: data || {},
        params: params || {}
      });
    }

    // INITIALIZE

    $log = $log.getInstance('DATA-SERVICE');

    // PUBLIC interface

    return {
      getInstance: getInstance
    };
  }
})();
