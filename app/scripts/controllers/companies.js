'use strict';

angular.module('projectxApp')
  .controller('CompaniesCtrl', function ($scope, $http, $state, ENV, $q, Session) {
    var accessToken = Session.getToken();
    $scope.company = {

    };
    
    $http.get(ENV.apiEndpoint + '/users/' + $state.params.userId + '/companies' + '?access_token=' + accessToken).then(
      function (response) {
        $scope.companies = response.data.companies;
        $state.go('companies.show');
      }
    );
    
    $scope.create = function create(){
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + '/companies?access_token='+ accessToken, $scope.company).then(
        function (response) {
          
          $state.go('companies.index');
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    };
  });

