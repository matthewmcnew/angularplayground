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
    'ui.bootstrap',
    'LocalStorageModule',
    'config', 
    'underscore'
  ])
  .config(function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('projectX');
  }).config(function ($stateProvider, $urlRouterProvider, userRoles, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/views/inside.html',
        data: {
          role: userRoles.user
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl',
        data: {
          role: userRoles.public
        }
      }).state('signup', {
        url: '/signup',
        templateUrl: '/views/signup.html',
        controller: 'SignupCtrl',
        data: {
          role: userRoles.public
        }
      }).state('inside', {
        url: '/inside',
        templateUrl: '/views/inside.html',
        controller: 'CompaniesCtrl',
        data: {
          role: userRoles.user
        }
      }).state('setup', {
        url: '/users/:userId/setup/:token',
        templateUrl: '/views/setup.html',
        controller: 'SetupCtrl',
        data: {
          role: userRoles.pubilc
        }
      }).state('timesheets', {
        url: '/employees',
        abstract: true,
        template: '<ui-view/>',
        controller: 'TimesheetsCtrl',
        data: {
          role: userRoles.user
        }
      }).state('timesheets.new', {
        url: '/:employee_id/timesheets/new',
        templateUrl: '/views/timesheets/new.html',
        data: {
          role: userRoles.user
        }
      }).state('timesheets.index', {
        url: '/:employee_id/timesheets',
        templateUrl: '/views/timesheets/index.html',
        data: {
          role: userRoles.user
        }
      }).state('timesheets.show', {
        url: '/:employee_id/timesheets/:timesheet_id',
        templateUrl: '/views/timesheets/show.html'
      }).state('companies', {
        abstract: true,
        url: '/companies',
        template: '<ui-view/>'
      }).state('companies.new', {
        url: '/new',
        templateUrl: '/views/companies/new.html',
        controller: 'CompaniesCtrl',
        data: {
          role: userRoles.user
        }
      }).state('companies.index', {
        url: '/',
        templateUrl: '/views/companies/index.html',
        controller: function($http, $scope,$stateParams, ENV, Session) {
          $http.get(ENV.apiEndpoint + 'api/users/' + $stateParams.userId + '/companies' + '?access_token=' + Session.getToken())
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
        templateUrl: '/views/companies/show.html',
        controller: function($http, $scope,$stateParams, ENV, Session) {
          $http.get(ENV.apiEndpoint + 'api/companies/'+ $stateParams.companyId + '?access_token=' + Session.getToken())
            .then(
              function(response){
                $scope.company = response.data.company;
              });
        },
        data: {
          role: userRoles.user
        }
      }).state('companies.employees', {
        abtract: true,
        url: '/:companyId/employees',
        template: '<ui-view/>' 
      }).state('companies.employees.new', {
        url: '/new',
        templateUrl: '/views/employees/new.html',
        controller: 'EmployeesCtrl',
        data: {
          role: userRoles.user
        }
      }).state('companies.employees.index', {
        url: '/',
        templateUrl: '/views/employees/index.html',
        controller: function($http, $scope,$stateParams, ENV, Session) {
          $http.get(ENV.apiEndpoint + 'api/companies/' + $stateParams.companyId + '/employees?access_token=' + Session.getToken())
            .then(
              function (response) {
                $scope.employees = response.data.company.employees;
                $scope.company = response.data.company;
              });
        },
        data: {
          role: userRoles.user
        }
      });
  }).run(function($rootScope, userRoles, Auth, $state){
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


