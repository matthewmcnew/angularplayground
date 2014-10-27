'use strict';
angular.module('projectxApp').factory('EmployeesService', function Auth($resource, $rootScope) {
   var _api = {};
   _api.createForm = $resource('api/companies/:companyId/employees/new', {companyId:'@id'});
   _api.submitForm = $resource('api/companies/:companyId/employees', { companyId:'@company_id' } );
  
  return {
      createForm: function(id) {
         _api.createForm.get({companyId: id}).$promise.then(function(response) {
            $rootScope.$broadcast('EmployeesService.createForm', response);
         }, function(error) {
            throw new Error('There was an error loading the form.', error);
         });
      }, 

      submitForm: function(data) {
         _api.submitForm.save(data).$promise.then(function() {
           $rootScope.$broadcast('EmployeesService.submitForm');
         }, 
         function(error) {
            $rootScope.$broadcast('EmployeesService.submitFormError', error);
         });
      }
   };
});
