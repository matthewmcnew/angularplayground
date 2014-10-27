'use strict';

angular.module('projectxApp').controller('SetupCtrl', function ($scope, $state, ENV, Session, Setup) {
    
    $scope.user = {
    };

    $scope.setup = function setup() {
      Setup.setup($state.params.userId, $scope.user);
    };

    // Success listener: Setup
    $scope.$on('Setup.setup', function() {
      $state.go('inside');
    });

    // Failure listener: Setup Error
    $scope.$on('Setup.setupError', function(event, response) {
      $scope.errors = response.data.messages;
    });
});

