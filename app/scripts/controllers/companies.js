'use strict';

angular.module('projectxApp')
  .controller('CompaniesCtrl', function ($scope, $http, $state, ENV, $q, Session) {

    var accessToken = Session.getToken();

    $scope.company = {

    };
    
    if($state.current.name === 'companies.new') {
      $http.get(ENV.apiEndpoint + 'api/users/' + $state.userId + '/companies/new' + '?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.fields = response.data.company.fields;
            $scope.links = response.data.company.links;
          }
        );
    };
    
    $scope.post_link = function() {
      return _.chain($scope.links)
        .filter(function(link) { return link.rel == 'create'; })
        .pluck('href')
        .value();
    }

    $scope.create = function create(){
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + $scope.post_link() + '?access_token='+ accessToken, $scope.company).then(
        function (response) {
          $state.go('companies.index');
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );
    };
  });

