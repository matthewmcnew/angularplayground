'use strict';

/**
 * @ngdoc function
 * @name projectxApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the projectxApp
 */
angular.module('projectxApp')
  .controller('LoginCtrl', function ($scope, Auth) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function login(){
      Auth.login($scope.credentials).then(function(data){
      });
    };
  });
