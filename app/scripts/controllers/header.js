'use strict';

angular.module('projectxApp')
  .controller('HeaderCtrl', function ($scope, Auth, $state) {
    $scope.authenticated = Auth.isAuthenticated();

    $scope.$on('$stateChangeStart', function(){
      $scope.authenticated = Auth.isAuthenticated();
    });

    $scope.signout = function signout() {
      Auth.signout();
      $state.go('login');
    };

  });
