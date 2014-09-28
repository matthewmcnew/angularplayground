'use strict';

/**
 * @ngdoc overview
 * @name projectxApp
 * @description
 * # projectxApp
 *
 * Main module of the application.
 */
angular
  .module('projectxApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'LocalStorageModule'
  ])
  .config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('projectX');
  }).config(function ($stateProvider, $urlRouterProvider, userRoles) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          role: userRoles.public
        }
      }).state('signup', {
        url: "/signup",
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        data: {
          role: userRoles.public
        }
      }).state('inside', {
        url: "/inside",
        templateUrl: 'views/inside.html',
        controller: 'MainCtrl',
        data: {
          role: userRoles.user
        }
      });
  }).run(function($rootScope, userRoles, Auth, $state){
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var nextRole = next.data.role;
      if(nextRole == userRoles.user){
        if(!Auth.isAuthenticated()) {
          event.preventDefault();
          $state.go('login');
        }
      }
    });

  });
