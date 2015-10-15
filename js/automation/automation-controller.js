(function () {
	'use strict';

	angular
	.module('accela.automation')
	.controller('AutomationController', controller);

	function controller($scope, $log, DataService) {

    // PRIVATE data

    var dataService = DataService.getInstance('FORMS');

    // PUBLIC data

    $scope.formData = {};

    // PRIVATE METHODS

    function stateChangeEventHandler(event, toState, toParams, fromState, fromParams, error) {
      var msg = '%s from "%s" to "%s"'.format(event.name, fromState.name, toState.name);

      if (error) { // customErrorMessage is attached by http-interceptor
        $log.error('%s : %s'.format(msg, error.customErrorMessage));
      } else {
        $log.debug(msg);
      }
    }

		// EVENT handlers

		$scope.$on('$stateChangeStart', stateChangeEventHandler);
		$scope.$on('$stateChangeSuccess', stateChangeEventHandler);
		$scope.$on('$stateChangeError', stateChangeEventHandler);

    $scope.$on('error.alert', function(event, err) {
      $log.error(err.msg);
    });

		// INITIALIZE

		$log = $log.getInstance('AUTOMATION-CONTROLLER');

    dataService.send('GET_FIELDS').then(function(response) {
      $scope.formData = response.data.result.fields;
    });

		$scope.$on('$destroy', function () {
			$log.warn('destroyed');
		});
	}
})();
