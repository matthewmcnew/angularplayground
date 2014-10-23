'use strict';

angular.module('projectxApp').factory('TimesheetsService', function Auth(ENV, $resource, $rootScope) {

   // Object to hold resources for companies.
   var _api = {};
   _api.createForm = $resource(ENV.apiEndpoint + 'api/employees/:employee_id/timesheets/new', {employee_id:'@employee_id'});
   _api.timeSheets = $resource(ENV.apiEndpoint + 'api/employees/:employee_id/timesheets', {employee_id:'@employee_id'});
   _api.timeSheetsSubmit = $resource(ENV.apiEndpoint + 'api/timesheets/:timesheet_id/submit', {timesheet_id:'@timesheet_id'});

   return {
      
      timeSheetIndex: function(employee_id, token) {
         _api.timeSheets.get({'employee_id':employee_id, 'access_token': token}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimesheetsService.timeSheetIndex', response);
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('TimesheetsService.timeSheetIndexError', error);
         });
      },
      
      createForm: function(employee_id, token) {
         _api.createForm.get({employee_id: employee_id, access_token: token}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimesheetsService.createForm', response);
         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      }, 
      
      submitForm: function(data) {

         _api.timeSheets.save(data).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimesheetsService.submitForm', response);
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('TimesheetsService.submitFormError', error);
         });
      },

      timeSheetsSubmit: function(timesheet_id, token) {

         _api.timeSheetsSubmit.save({timesheet_id: timesheet_id, access_token: token}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimesheetsService.timeSheetsSubmit', response);
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('TimesheetsService.timeSheetsSubmitError', error);
         });
      }
   };
});
