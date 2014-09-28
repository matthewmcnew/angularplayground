'use strict';

angular.module('projectxApp')
  .factory('Session', function () {
    var accessToken;

    function create(newToken) {
      accessToken = newToken;
    };

    function getToken() {
      return accessToken;
    };

    return {
      create: create,
      getToken: getToken
    };
  });
