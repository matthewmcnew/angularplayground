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
    'LocalStorageModule',
    'config'
  ])
  .config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('projectX');
  }).config(function ($stateProvider, $urlRouterProvider, userRoles) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          role: userRoles.public
        }
      }).state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        data: {
          role: userRoles.public
        }
      }).state('inside', {
        url: '/inside',
        templateUrl: 'views/inside.html',
        controller: 'CompaniesCtrl',
        data: {
          role: userRoles.user
        }
      }).state('setup', {
        url: '/users/:userId/setup/:token',
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl',
        data: {
          role: userRoles.pubilc
        }
      }).state('companies', {
        abstract: true,
        url: '/companies',
        template: '<ui-view/>'
      }).state('companies.new', {
        url: '/new',
        templateUrl: 'views/companies/new.html',
        controller: function($http, $scope,$stateParams, ENV, Session) {
          $http.get(ENV.apiEndpoint + '/users/' + $stateParams.userId + '/companies/new' + '?access_token=' + Session.getToken())
            .then(
              function (response) {
                $scope.fields = response.data.company.fields;
              }
            );
        },
        data: {
          role: userRoles.user
        }
      }).state('companies.index', {
        url: '/',
        templateUrl: 'views/companies/index.html',
        controller: function($http, $scope,$stateParams, ENV, Session) {
          $http.get(ENV.apiEndpoint + '/users/' + $stateParams.userId + '/companies' + '?access_token=' + Session.getToken())
            .then(
              function (response) {
                $scope.companies = response.data.companies;
              }
            );
        },
        data: {
          role: userRoles.user
        }
      }).state('companies.show', {
        url: '/:companyId',
        templateUrl: 'views/companies/show.html',
        controller: function($http, $scope,$stateParams, ENV, Session) {
          $http.get(ENV.apiEndpoint + '/companies/'+ $stateParams.companyId + '?access_token=' + Session.getToken())
            .then(
              function(response){
                $scope.company = response.data.company;
              });
        },
        data: {
          role: userRoles.pubilc
        }
      })}).run(function($rootScope, userRoles, Auth, $state){
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var nextRole = next.data.role;
      if(nextRole === userRoles.user){
        if(!Auth.isAuthenticated()) {
          event.preventDefault();
          $state.go('login');
        }
      }
    });

  });

