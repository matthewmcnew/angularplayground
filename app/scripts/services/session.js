'use strict';

angular.module('projectxApp')
  .factory('Session', function (localStorageService) {
    var accessToken = localStorageService.get('accessToken');

    function create(newToken) {
      localStorageService.set('accessToken', newToken);
      accessToken = newToken;
    };

    function destroy() {
      accessToken = null;
    };

    function getToken() {
      return accessToken;
    };

    return {
      create: create,
      destroy: destroy,
      getToken: getToken
    };
  });
