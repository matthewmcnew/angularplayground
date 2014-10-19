'use strict';

angular.module('projectxApp')
  .controller('HeaderCtrl', function ($scope, Auth, $state) {

    // $stateChangeStart - fired when the transition begins
    $scope.$on('$stateChangeStart', function(){
      $scope.authenticated = Auth.isAuthenticated();
    });

    // Action to sign out a user. Doesn't seem to be working at the moment.
    $scope.signout = function signout() {
      Auth.signout();
      $state.go('login');
    };

  });
