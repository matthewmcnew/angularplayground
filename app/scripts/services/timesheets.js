'use strict';

angular.module('projectxApp').factory('TimesheetsService', function Auth(ENV, $resource, $rootScope) {

   // Object to hold resources for companies.
   var _api = {};
   _api.createForm = $resource(ENV.apiEndpoint + 'api/employees/1/timesheets/new', {userId:'@id'});
   _api.timeSheets = $resource(ENV.apiEndpoint + 'api/employees/1/timesheets');

   return {
      
      timeSheetIndex: function(token) {
         _api.timeSheets.get({access_token: token}).$promise.then(function(response) {
            // broadcast success event
            console.log(response)
            $rootScope.$broadcast('TimesheetsService.timeSheetIndex', response);
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('TimesheetsService.timeSheetIndexError', error);
         });
      },
      
      createForm: function(id, token) {
         _api.createForm.get({userId: id, access_token: token}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimesheetsService.createForm', response);
         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      }, 
      
      submitForm: function(data) {
         _api.timeSheets.save(data).$promise.then(function() {
            // broadcast success event
            $rootScope.$broadcast('TimesheetsService.submitForm');
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('TimesheetsService.submitFormError', error);
         });
      }
   };
});
