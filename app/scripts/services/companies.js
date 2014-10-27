'use strict';

angular.module('projectxApp').factory('CompaniesService', function Auth($resource, $rootScope) {

   // Object to hold resources for companies.
   var _api = {};

   _api.createForm = $resource('api/users/:userId/companies/new', {userId:'@id'});
   _api.submitForm = $resource('api/companies');
   _api.submitUpdateForm = $resource('api/companies/:company_id/update', { company_id: '@company_id' });
   _api.company = $resource('api/companies/:company_id', {company_id:'@company_id'});
   
   return {
      /* Gets data to build the new company form.
      * @param id - current user id
      */

      companiesEdit: function(company_id) {
         _api.company.get({'company_id':company_id}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('CompaniesService.companiesEdit', response);
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('CompaniesService.companiesEditError', error);
         });
      },

      createForm: function(id) {
         _api.createForm.get({userId: id}).$promise.then(function(response) {
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
      },

      submitUpdateForm: function(data) {
         _api.submitUpdateForm.save({company_id: data.id}, data).$promise.then(function() {
            // broadcast success event
            $rootScope.$broadcast('CompaniesService.submitUpdateForm');
         }, 
         function(error) {
            // broadcast failure event
            $rootScope.$broadcast('CompaniesService.submitUpdateForm', error);
         });
      }
   };
});
