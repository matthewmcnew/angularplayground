'use strict';
angular.module('projectxApp')
  .controller('EmployeesCtrl', function ($scope, $http, $state, ENV, $q, Session) {
    var accessToken = Session.getToken();

    $scope.employee = {

    };

    if( $state.current.name === 'companies.employees.new') {
      $http.get(ENV.apiEndpoint + 'api/companies/' + $state.params.companyId + '/employees/new?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.fields = response.data.employee.fields;
            $scope.links = response.data.links;
          }
        );
    }

    if( $state.current.name === 'companies.employees.index') {
      $http.get(ENV.apiEndpoint + 'api/companies/' + $state.params.companyId + '/employees?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.employees = response.data.employees;
            $scope.companyId = $state.params.companyId
          }
        );
    }
    
    $scope.post_link = function() {
      return _.chain($scope.links)
        .filter(function(link) { return link.rel === 'create'; })
        .pluck('href')
        .value();
    }

    $scope.create = function (){
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + $scope.post_link($scope.links) + '?access_token='+ accessToken, $scope.employee).then(
        function (response) {
          $state.go('companies.show', { companyId: response.data.employee.company.id });
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    };

  });

