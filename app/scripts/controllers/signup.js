'use strict';

angular.module('projectxApp').controller('SignupCtrl', function ($scope, Auth, $state) {
    $scope.user = {
    };

    $scope.signup = function signup() {
      Auth.signup($scope.user);
    };

    // Success listener: User signed up
    $scope.$on('Auth.signup', function() {
      $state.go('inside');
    });

    // Failure listener: Error with User signed up
    $scope.$on('Auth.signupError', function(event, response) {
      $scope.errors = response.data.messages;
    });

  });
