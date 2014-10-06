'use strict';

 angular
  .module('config', [])
  .constant('ENV', {name:'staging',apiEndpoint:'http://staging-projectx-api.herokuapp.com/api'})
//.constant('ENV', {name:'development',apiEndpoint:'http://st/api'})

