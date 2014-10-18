'use strict';

angular.module('projectxApp')
  .controller('CompaniesCtrl', function ($scope, $http, $state, ENV, $q, Session) {

    var accessToken = Session.getToken();

    $scope.company = {

    };

    $scope.employee = {

    };
    
    if($state.current.name === 'companies.new') {
      $http.get(ENV.apiEndpoint + 'api/users/' + $state.userId + '/companies/new' + '?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.fields = response.data.company.fields;
            $scope.links = response.data.company.links;
          }
        );
    }
    
    if( $state.current.name === 'companies.employees') {
      $http.get(ENV.apiEndpoint + 'api/companies/' + $state.params.companyId + '/employees/new?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.fields = response.data.employee.fields;
            $scope.links = response.data.links;
          }
        );
    }

    $scope.invite_employee = function (){
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + $scope.post_link($scope.links) + '?access_token='+ accessToken, $scope.employee).then(
        function (response) {
          debugger
          $state.go('companies.show', { companyId: response.data.employee.company.id });
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    }

    $scope.post_link = function() {
      return _.chain($scope.links)
        .filter(function(link) { return link.rel === 'create'; })
        .pluck('href')
        .value();
    }
    
    $scope.create = function create(){
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + $scope.post_link() + '?access_token='+ accessToken, $scope.company).then(
        function (response) {
          $state.go('companies.show', { companyId: response.data.company.id });
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    };
  });

