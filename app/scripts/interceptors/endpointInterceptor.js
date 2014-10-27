'use strict';

angular.module('projectxApp').factory('EndpointInterceptor', function EndpointInterceptor(ENV) {
  function requestInterceptor(request) {
    if(request.url.indexOf("api") != -1 && request.url.indexOf("http") == -1) {
      request.url = ENV.apiEndpoint + request.url;
    }

    return request;
  };

  return {
    request: requestInterceptor
  };

});
