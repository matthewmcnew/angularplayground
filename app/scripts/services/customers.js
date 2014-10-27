'use strict';

angular.module('projectxApp').factory('CustomersService', function Auth($http, $rootScope, $resource) {

  function newCustomerPath(data) {
    return 'api/companies/:companyId/customers/new'.replace(':companyId', data.companyId);
  }

  return {
    createForm: function (id) {
       return $http.get(newCustomerPath({companyId: id}));
    },
    submitForm: function (path, data) {
      return $http.post(path, {customer: data});
    }
  };
});
