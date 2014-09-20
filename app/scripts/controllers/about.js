'use strict';

/**
 * @ngdoc function
 * @name projectxApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the projectxApp
 */
angular.module('projectxApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
