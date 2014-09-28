'use strict';

angular.module('projectxApp')
  .controller('LoginCtrl', function ($scope, Auth, $state) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function login() {
      Auth.login($scope.credentials).then(
        function () {
          $state.go('inside');
        },function (errors) {
          $scope.errors = true;
        }
      );
    };
  });
