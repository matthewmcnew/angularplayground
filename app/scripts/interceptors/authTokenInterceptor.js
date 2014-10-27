'use strict';

angular.module('projectxApp').factory('AuthTokenInterceptor', function AuthTokenInterceptor(Session) {
  function requestInterceptor(request) {
    if(request.url.indexOf("api") != -1 && Session.getToken()) {
      request.url = request.url + "?access_token=" + Session.getToken();
    }

    return request;
  };

  return {
    request: requestInterceptor
  };

});
