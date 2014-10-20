'use strict';

angular.module('projectxApp').factory('CompaniesService', function Auth(ENV, $resource, $rootScope) {

   // Object to hold resources for companies.
   var _api = {};
   _api.createForm = $resource(ENV.apiEndpoint + 'api/users/:userId/companies/new', {userId:'@id'});
   _api.submitForm = $resource(ENV.apiEndpoint + 'api/companies');

   return {
      /* Gets data to build the new company form.
      * @param id - current user id
      * @param token - user access token. 
      */
      createForm: function(id, token) {
         _api.createForm.get({userId: id, access_token: token}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('CompaniesService.createForm', response);
         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      }, 

      /* Submits the form to create a new company.
      * @param data - Form object model 
      */
      submitForm: function(data) {
         _api.submitForm.save(data).$promise.then(function() {
            // broadcast success event
            $rootScope.$broadcast('CompaniesService.submitForm');
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('CompaniesService.submitFormError', error);
         });
      }
   };
});
