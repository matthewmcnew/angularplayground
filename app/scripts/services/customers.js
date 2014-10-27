'use strict';

angular.module('projectxApp').factory('CustomersService', function Auth(ENV, $http, $rootScope, $resource) {

  function newCustomerPath(data) {
    return ENV.apiEndpoint + 'api/companies/:companyId/customers/new'.replace(':companyId', data.companyId);
  }

  return {
    createForm: function (id) {
       return $http.get(newCustomerPath({companyId: id}));
    },
    submitForm: function (path, data) {
      path = ENV.apiEndpoint + path;
      return $http.post(path, {customer: data});
    }
  };
});
