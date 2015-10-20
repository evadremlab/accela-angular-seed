(function() {
  'use strict';

  angular
    .module('accela.core')
    .directive('timer', function($interval) {
      return {
        scope: {
          seconds: '='
        },
        template: '<div class="timer">{{seconds}}</div>',
        link: function($scope, element, attrs) {
          var intervalId = $interval(function() {
            if ($scope.seconds-- === 0) {
              $interval.cancel(intervalId);
              element.replaceWith('DONE');
            }
          }, 1000);
        }
      };
    });
})();