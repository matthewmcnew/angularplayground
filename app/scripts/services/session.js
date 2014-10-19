'use strict';

angular.module('projectxApp').factory('Session', function (localStorageService) {
    var accessToken = localStorageService.get('accessToken');

    return {
      create: function(newToken) {
        localStorageService.set('accessToken', newToken);
        accessToken = newToken;
      },

      destroy: function() {
        accessToken = null;
        localStorageService.remove('accessToken');
      },

      getToken: function() {
        return accessToken;
      }
    };
  });
