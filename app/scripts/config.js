'use strict';

 angular
  .module('config', [])
  .constant('ENV', {name:'development',apiEndpoint:'http://staging-projectx-api.herokuapp.com/api'})
//.constant('ENV', {name:'development',apiEndpoint:'http://localhost:3000/api'})

