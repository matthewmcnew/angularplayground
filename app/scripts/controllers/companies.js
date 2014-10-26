'use strict';

angular.module('projectxApp').controller('CompaniesCtrl', function ($scope, $state, ENV, Session, CompaniesService, _) {

  var accessToken = Session.getToken();
  $scope.company = {};
  $scope.errors = {};
  $scope.route = {};
  
  // ---------- Page routing ----------//
    $scope.route.edit = function() {
      $state.go('companies.edit', {company_id: $scope.company.id});
    };


  // ----------  Gets Company for edit page  ---------- //
    $scope.companiesEdit = function() {
      CompaniesService.companiesEdit($state.params.companyId, accessToken);
    };

  //Success listener: Get company for edit.
    $scope.$on('CompaniesService.companiesEdit', function(event, response) {
      $scope.company = response.company;
    });

    // Failure Listerner: not able to get company.
    $scope.$on('CompaniesService.companiesEditError', function() {
      console.log('what goins on!');
    });

  /*
  * Executed by ng-init inside of the create form partial.
  */
  $scope.createForm = function() { 
    /*
    * This is a weird one. As far as I can tell "$state.userId" never exists but the api needs 
    * a format like: /api/users/1/companies/new. Because I changed from using $http to angular's $resouce
    * service the service parses it out completely and it becomes /api/users/companies/new which causes the api request to fail.
    * so for now I'm defaulting "$state.userId" to (int) 1, need to swing back and get this figured out though.
    */
    var id = ($state.userId === undefined || $state.userId === null) ? 1 : $state.userId;
    // Calls the service to perfom the request
    CompaniesService.createForm(id, accessToken); 
  };

  /*
  * Controllers UI update Listeners 
  * These are usually listening for an event fired by a service that also holds
  * data returned from the server.
  * @param event - angular event, should always be the first parameter specified.
  */
  $scope.$on('CompaniesService.createForm', function(event, response) {
    $scope.fields = response.company.fields;
    $scope.links = response.company.links;
  });
  

  // Form submit action to create a new company
  $scope.create = function create(){
    // Applies access token to the form model
    $scope.company.access_token = accessToken;
    // Calls service with the new company model to be created.
    CompaniesService.submitForm($scope.company);
  };

  // Form submit action to update a company
  $scope.update = function update(){
    // Applies access token to the form model
    $scope.company.access_token = accessToken;
    // Calls service with the new company model to be created.
    CompaniesService.submitUpdateForm($scope.company);
  };

  //Success listener: New Company created
  $scope.$on('CompaniesService.submitForm', function() {
    $state.go('companies.index');
  });

  $scope.$on('CompaniesService.submitUpdateForm', function() {
    $state.go('companies.show');
  });


  // Failure Listerner: New company had validation errors.
  $scope.$on('CompaniesService.submitFormError', function(event, response) {
    $scope.errors.messages = JSON.parse(response.data.messages);
    // Match up the errors returned with the form name attributes to show erros in the UI.
    for (var message in $scope.errors.messages) {
      for (var field in $scope.fields) {
        if ($scope.fields[field].name === message) {
          $scope.fields[field].error = $scope.errors.messages[message][0];
        }
      }
    }
  });

  /*
  * Dynamically build parts of the form submit url
  * based on the response from the api. 
  * This isn't in use anymore and I need to come back
  * and see what the reasoning was for this.
  */
  $scope.post_link = function() {
    return _.chain($scope.links)
      .filter(function(link) { return link.rel === 'create'; })
      .pluck('href')
      .value();
  };
});

