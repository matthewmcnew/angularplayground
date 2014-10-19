'use strict';

angular.module('projectxApp').factory('Auth', function Auth($rootScope, $http, ENV, $q, Session, $resource) {
    
  // Object to hold resources for companies.
  var _api = {};
  _api.login = $resource(ENV.apiEndpoint + 'api/sessions');

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
       Session.destroy();
       return $http.delete(ENV.apiEndpoint + 'api/sessions');
    }

    // signup: function (user) {
    //   var deferred = $q.defer();
    //   $http.post(ENV.apiEndpoint + 'api/users', {user: user}).then(
    //     function (response) {
    //       Session.create(response.data.user.access_token);
    //       deferred.resolve();
    //     }, function failure(response) {
    //       deferred.reject(response.data.messages);
    //     }
    //   );

    //   return deferred.promise;
    // }

    // function isAuthenticated(){
    //   return !!Session.getToken();
    // }
  };

});
