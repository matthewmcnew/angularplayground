'use strict';

angular.module('projectxApp')
  .controller('SetupCtrl', function ($scope, $http, $state, ENV, $q, Session) {
    $scope.user = {
    };

    $scope.setup = function setup() {
      var deferred = $q.defer();

      $http.post(ENV.apiEndpoint + '/users/' + $state.params.userId + '/setup_account/' + $state.params.token, $scope.user).then(
        function (response) {
          Session.create(response.data.user.access_token);
          deferred.resolve();
          $state.go('inside');
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );

    };
  });

