'use strict';

angular.module('projectxApp')
  .factory('CompaniesService', function Auth(ENV, $resource, $rootScope) {

  		var _api = {};
  		_api.newCompanyForm = $resource(ENV.apiEndpoint + 'api/users/:userId/companies/new', {userId:'@id'});

  		return {
			createForm: function(id, token) {
  				_api.newCompanyForm.get({userId: id, access_token: token}).$promise.then(function(response) {
  					$rootScope.$broadcast('CompaniesService.newCompanyForm', response.company);
  				});
			}
		};
 });
