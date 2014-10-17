'use strict';

angular.module('projectxApp')
  .controller('CompaniesCtrl', function ($scope, $http, $state, ENV, $q, Session, CompaniesService, _) {

    var accessToken = Session.getToken();
    var id = ($state.userId === undefined || $state.userId === null) ? 1 : $state.userId;
    $scope.company = {};

    
    $scope.$on('CompaniesService.newCompanyForm', function(event, response) {
      $scope.fields = response.fields;
      $scope.links = response.links;
    });
    
    
    $scope.newCompanyForm = function() { 
      CompaniesService.createForm(id, accessToken); 
    };
    

    $scope.post_link = function() {
      console.log($scope.links);
      return _.chain($scope.links)
        .filter(function(link) { return link.rel === 'create'; })
        .pluck('href')
        .value();
    };

    $scope.create = function create(){
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + $scope.post_link() + '?access_token='+ accessToken, $scope.company).then(
        function () {
          $state.go('companies.index');
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    };
  });

