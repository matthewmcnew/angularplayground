'use strict';

angular.module('projectxApp').controller('LoginCtrl', function ($scope, Auth, $state) {
  if(Auth.isAuthenticated()) {
    $state.go('home');
  }

  // Form model for username and password
  $scope.credentials = {
    username: '',
    password: ''
  };

  // Form submit action to login
  $scope.login = function login() {
    // Call Auth service and pass login form user model
    Auth.login($scope.credentials);
  };

  //Success listener: User logged in
  $scope.$on('Auth.login', function() {
    $state.go('inside');
  });

  // Failure Listerner: Bad credentials
  $scope.$on('Auth.loginError', function(event, response) {
    // Bind the new errorMessage to the DOM
    $scope.errorMessage = response.data.messages;
  });
});
