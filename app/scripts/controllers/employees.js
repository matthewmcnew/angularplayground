'use strict';
angular.module('projectxApp')
  .controller('EmployeesCtrl', function ($scope, $state, Session, EmployeesService, _, $q, $http) {

    $scope.employee = {};
    
    $scope.createForm = function() { 
      EmployeesService.createForm($state.params.companyId);
    };

    $scope.$on('EmployeesService.createForm', function(event, response) {
      $scope.fields = response.employee.fields;
      $scope.links = response.links;
      $scope.company = response.company;
    });

    $scope.create = function create(){
      $scope.employee.company_id = $state.params.companyId;

      EmployeesService.submitForm($scope.employee);
    };

    $scope.$on('EmployeesService.submitForm', function() {
      $state.go('companies.employees.index', {companyId: $state.params.companyId });
    });

    $scope.post_link = function() {
      return _.chain($scope.links)
        .filter(function(link) { return link.rel === 'create'; })
        .pluck('href')
        .value();
    };


    $scope.create = function (){
      var deferred = $q.defer();
      $http.post($scope.post_link(), $scope.employee).then(
        function (response) {
          $state.go('companies.show', { companyId: response.data.employee.company.id });
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    };

  });

