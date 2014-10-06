'use strict';

angular.module('projectxApp')
  .controller('CompaniesCtrl', function ($scope, $http, $state, ENV, $q, Session) {
    var accessToken = Session.getToken();

    $http.get(ENV.apiEndpoint + '/users/' + $state.params.userId + '/companies' + '?access_token=' + accessToken).then(
      function (response) {
        $scope.companies = response.data.companies;
      }
    );
  });

