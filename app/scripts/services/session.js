'use strict';

angular.module('projectxApp').factory('Session', function (localStorageService) {
    var accessToken = localStorageService.get('accessToken');
    var userId = localStorageService.get('userId');

    return {
      create: function(user) {
        localStorageService.set('accessToken', user.access_token);
        localStorageService.set('userId', user.id);
        accessToken = user.access_token;
        userId = user.id;
      },

      destroy: function() {
        accessToken = null;
        userId = null;
        localStorageService.remove('accessToken');
        localStorageService.remove('userId');
      },

      getToken: function() {
        return accessToken;
      },

      getUserID: function() {
        return userId;
      }
    };
  });
