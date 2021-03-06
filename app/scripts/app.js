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
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('projectX');
  }).config(function ($stateProvider, $urlRouterProvider, userRoles, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthTokenInterceptor');
    $httpProvider.interceptors.push('EndpointInterceptor');

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
      }).state('companies.edit', {
        url: '/:companyId/edit',
        templateUrl: '/views/companies/edit.html',
        controller: 'CompaniesCtrl',
        data: {
          role: userRoles.user
        }
      }).state('companies.index', {
        url: '/',
        templateUrl: '/views/companies/index.html',
        controller: function($http, $scope,$stateParams, Session) {
          $http.get('api/users/' + $stateParams.userId + '/companies')
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
        controller: 'CompaniesShowCtrl',
        data: {
          role: userRoles.user
        }
      }).state('companies.customers', {
        abtract: true,
        url: '/:companyId/customers',
        template: '<ui-view/>',
        controller: 'CompaniesShowCtrl'
      }).state('companies.customers.index', {
        url: '/',
        templateUrl: '/views/customers/index.html',
        controller: function ($http, $scope, $stateParams, Session) {
          $http.get('api/companies/' + $stateParams.companyId + '/customers')
            .then(function (response) {
              $scope.customers = response.data.customers;
            });
        },
        data: {
          role: userRoles.user
        }
      }).state('companies.customers.new', {
        url: '/new',
        templateUrl: '/views/customers/new.html',
        controller: 'CustomersCtrl',
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
        controller: function ($http, $scope, $stateParams, Session) {
          $http.get('api/companies/' + $stateParams.companyId + '/employees')
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
  }).run(function ($rootScope, userRoles, Auth, $state) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var nextRole = next.data.role;
      if (nextRole === userRoles.user) {
        if (!Auth.isAuthenticated()) {
          event.preventDefault();
          $state.go('login');
        }
      }
    });
  });


