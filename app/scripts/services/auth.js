'use strict';

angular.module('projectxApp')
  .factory('Auth', function Auth($http, ENV, $q, Session) {
    function login(credentials) {
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + 'api/sessions', credentials).then(
        function (response) {
          Session.create(response.data.user.access_token);

          deferred.resolve();
        }, function () {
          deferred.reject();
        }
      );
      return deferred.promise;
    }

    function signout() {
      Session.destroy();
      return $http.delete(ENV.apiEndpoint + 'api/sessions');
    }

    function signup(user) {
      var deferred = $q.defer();
      $http.post(ENV.apiEndpoint + 'api/users', {user: user}).then(
        function (response) {
          Session.create(response.data.user.access_token);
          deferred.resolve();
        }, function failure(response) {
          deferred.reject(response.data.messages);
        }
      );

      return deferred.promise;
    }

    function isAuthenticated(){
      return !!Session.getToken();
    }

    return {
      login: login,
      signup: signup,
      signout: signout,
      isAuthenticated: isAuthenticated
    };
  });
