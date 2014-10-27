'use strict';

angular.module('projectxApp').factory('Auth', function Auth($rootScope, $http, $q, Session, $resource) {
    
  // Object to hold resources for companies.
  var _api = {};
  _api.login = $resource('api/sessions/:id', {id: '@id'});
  _api.signup = $resource('api/users');

  return {

    login: function (credentials) {
      _api.login.save(credentials).$promise.then(function(response) {
        Session.create(response.user);
        $rootScope.$broadcast('Auth.login', response);
      }, function(error) {
        $rootScope.$broadcast('Auth.loginError', error);
      });
    }, 

    isAuthenticated: function() {
      return !!Session.getToken();
    },

    signout: function() {
      _api.login.delete({id:Session.getUserID()}).$promise.then(function(response) {
        Session.destroy();
        $rootScope.$broadcast('Auth.signout', response);
      });
    },

    signup: function (user) {
      _api.signup.save({user: user}).$promise.then(function(response) {
        Session.create(response.user);
        $rootScope.$broadcast('Auth.signup', response);
      }, function (response) {
        $rootScope.$broadcast('Auth.signupError', response);
      });
    }
  };

});
