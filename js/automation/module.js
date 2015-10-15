/**
 * TBD
 */
(function () {
  'use strict';

  angular
    .module('accela.automation', [
      'accela.core'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {

      // use "ui-router" to define ???

      $stateProvider
        .state('default', {
          url: '/',
          controller: 'AutomationController',
          templateUrl: 'views/index.html'
        });

      // provide a fallback for non-matching routes

      $urlRouterProvider.otherwise('/');

    }).run(function ($rootScope, $state) {
      $rootScope.$state = $state;
    });
})();
