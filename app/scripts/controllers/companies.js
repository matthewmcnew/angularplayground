'use strict';

angular.module('projectxApp')
  .controller('CompaniesCtrl', function ($scope, $http, $state, ENV, $q, Session) {

    var accessToken = Session.getToken();

    $scope.company = {

    };
    
    if($state.current.name === 'companies.new') {
      $http.get(ENV.apiEndpoint + '/users/' + $state.userId + '/companies/new' + '?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.fields = response.data.company.fields;
          }
        );
    };
    
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

