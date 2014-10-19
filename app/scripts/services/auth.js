'use strict';

angular.module('projectxApp').factory('Auth', function Auth($rootScope, $http, ENV, $q, Session, $resource) {
    
  // Object to hold resources for companies.
  var _api = {};
  _api.login = $resource(ENV.apiEndpoint + 'api/sessions');
  _api.signup = $resource(ENV.apiEndpoint + 'api/users');

  return {

    login: function (credentials) {
      _api.login.save(credentials).$promise.then(function(response) {
        Session.create(response.user.access_token);
        $rootScope.$broadcast('Auth.login', response);
      }, function(error) {
        $rootScope.$broadcast('Auth.loginError', error);
      });
    }, 

    isAuthenticated: function() {
      return !!Session.getToken();
    },

    signout: function() {
      _api.login.delete().$promise.then(function(response) {
        Session.destroy();
        $rootScope.$broadcast('Auth.signout', response);
      });
    },

    signup: function (user) {
      _api.signup.save({user: user}).$promise.then(function(response) {
        Session.create(response.user.access_token);
        $rootScope.$broadcast('Auth.signup', response);
      }, function (response) {
        $rootScope.$broadcast('Auth.signupError', response);
      });
    }
  };

});
