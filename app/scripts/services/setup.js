'use strict';

angular.module('projectxApp').factory('Setup', function Auth($rootScope, ENV, Session, $resource) {
    
	// Object to hold resources for companies.
	var _api = {};
	_api.setup = $resource(ENV.apiEndpoint + 'api/users/:userId/setup_account', {userId:'@id', token: '@tk'});

	return {
		/* Submits the form to create a new company.
		* @param data - Form object model 
		*/
		setup: function(id, token, user) {
			_api.setup.save({userId: id, access_token: token}, {user: user}).$promise.then(function(response) {
				// broadcast success event
				Session.create(response.user);
				$rootScope.$broadcast('Setup.setup');
			}, 
			function(error) {
				// broadcast failure event
				$rootScope.$broadcast('setup.setupError', error);
			});
		}
	};
  
});
