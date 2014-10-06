"use strict";angular.module("config",[]).constant("ENV",{name:"staging",apiEndpoint:"http://staging-projectx-api.herokuapp.com/api"}),angular.module("projectxApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","LocalStorageModule","config"]).config(["localStorageServiceProvider",function(a){a.setPrefix("projectX")}]).config(["$stateProvider","$urlRouterProvider","userRoles",function(a,b,c){b.otherwise("/login"),a.state("login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl",data:{role:c.public}}).state("signup",{url:"/signup",templateUrl:"views/signup.html",controller:"SignupCtrl",data:{role:c.public}}).state("inside",{url:"/inside",templateUrl:"views/inside.html",controller:"CompaniesCtrl",data:{role:c.user}}).state("setup",{url:"/users/:userId/setup/:token",templateUrl:"views/setup.html",controller:"SetupCtrl",data:{role:c.pubilc}}).state("companies",{url:"/companies",templateUrl:"views/companies/index.html",controller:"CompaniesCtrl",data:{role:c.pubilc}}).state("companies.new",{url:"/new",templateUrl:"views/companies/new.html",controller:"CompaniesCtrl",data:{role:c.pubilc}}).state("companies.show",{url:"/companies/:companyId",templateUrl:"companies/show.html",controller:"CompaniesCtrl",data:{role:c.pubilc}})}]).run(["$rootScope","userRoles","Auth","$state",function(a,b,c,d){a.$on("$stateChangeStart",function(a,e){var f=e.data.role;f===b.user&&(c.isAuthenticated()||(a.preventDefault(),d.go("login")))})}]),angular.module("projectxApp").controller("HeaderCtrl",["$scope","Auth","$state",function(a,b,c){a.authenticated=b.isAuthenticated(),a.$on("$stateChangeStart",function(){a.authenticated=b.isAuthenticated()}),a.signout=function(){b.signout(),c.go("login")}}]),angular.module("projectxApp").controller("LoginCtrl",["$scope","Auth","$state",function(a,b,c){a.credentials={username:"",password:""},a.login=function(){b.login(a.credentials).then(function(){c.go("inside")},function(){a.errors=!0})}}]),angular.module("projectxApp").controller("CompaniesCtrl",["$scope","$http","$state","ENV","$q","Session",function(a,b,c,d,e,f){var g=f.getToken();a.company={},a.show=function(){b.get(d.apiEndpoint+"/users/"+c.params.userId+"/companies?access_token="+g).then(function(b){a.companies=b.data.companies,c.go("companies")})},a.show=function(e){b.get(d.apiEndpoint+"/companies/"+e+"?access_token="+g).then(function(b){a.company=b.data.companies,c.go("companies.show")},function(a){deferred.reject(a.data.messages)})},a.create=function(){var f=e.defer();b.post(d.apiEndpoint+"/companies?access_token="+g,a.company).then(function(){c.go("inside")},function(a){f.reject(a.data.messages)})}}]),angular.module("projectxApp").controller("SignupCtrl",["$scope","Auth","$state",function(a,b,c){a.user={},a.signup=function(){b.signup(a.user).then(function(){c.go("inside")},function(b){a.errors=b})}}]),angular.module("projectxApp").controller("SetupCtrl",["$scope","$http","$state","ENV","$q","Session",function(a,b,c,d,e,f){a.user={},a.setup=function(){var g=e.defer();b.post(d.apiEndpoint+"/users/"+c.params.userId+"/setup_account/"+c.params.token,a.user).then(function(a){f.create(a.data.user.access_token),g.resolve(),c.go("inside")},function(a){g.reject(a.data.messages)})}}]),angular.module("projectxApp").controller("MainCtrl",function(){}),angular.module("projectxApp").constant("userRoles",{"public":"public",user:"user"}),angular.module("projectxApp").factory("Session",["localStorageService",function(a){function b(b){a.set("accessToken",b),e=b}function c(){e=null}function d(){return e}var e=a.get("accessToken");return{create:b,destroy:c,getToken:d}}]),angular.module("projectxApp").factory("Auth",["$http","ENV","$q","Session",function(a,b,c,d){function e(e){var f=c.defer();return a.post(b.apiEndpoint+"/sessions",e).then(function(a){d.create(a.data.user.access_token),f.resolve()},function(){f.reject()}),f.promise}function f(){return d.destroy(),a.delete(b.apiEndpoint+"/sessions")}function g(e){var f=c.defer();return a.post(b.apiEndpoint+"/users",{user:e}).then(function(a){d.create(a.data.user.access_token),f.resolve()},function(a){f.reject(a.data.messages)}),f.promise}function h(){return!!d.getToken()}return{login:e,signup:g,signout:f,isAuthenticated:h}}]);