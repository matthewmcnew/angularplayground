'use strict';

angular.module('projectxApp')
  .factory('Auth', function Auth($http, apiLocation) {
    function login(credentials){
       return $http.post(apiLocation + "/sessions", credentials).then(function(response) {
         //do something
       });
    };

    function signup(user){
      console.log({user: user});
      return $http.post(apiLocation + "/users", {user: user}).then(function(response) {
        //do something
        return "sucess";
      }, function failure(response) {
        return "failure";
      });
    };


    return {
      login: login,
      signup: signup
    };
  });
