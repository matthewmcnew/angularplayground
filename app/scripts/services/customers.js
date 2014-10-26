'use strict';

angular.module('projectxApp').factory('CustomersService', function Auth(ENV, $http, $rootScope, $resource) {

  function newCustomerPath(data) {
    return ENV.apiEndpoint + 'api/companies/:companyId/customers/new?access_token=:accessToken'.replace(':companyId', data.companyId).replace(':accessToken', data.access_token);
  }

  return {
    createForm: function (id, token) {
       return $http.get(newCustomerPath({companyId: id, access_token: token}));
    },
    submitForm: function (path, data, token) {
      path = ENV.apiEndpoint + path + "?access_token=" + token;
      return $http.post(path, {customer: data});
    }
  };
});
