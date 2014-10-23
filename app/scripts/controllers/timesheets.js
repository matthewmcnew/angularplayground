'use strict';

angular.module('projectxApp')
  .controller('TimesheetsCtrl', function ($scope, $state, $stateParams, ENV, Session, $location, TimesheetsService, TimeSheetItemService) {
    var accessToken = Session.getToken();
    $scope.timesheet = {};
    $scope.newItem = {};
    $scope.item_project = '';
    $scope.item_description = '';
    $scope.item_hours = 0;
    $scope.errors = {};
    
    // ----------  Gets Timesheet lists for index page  ---------- //
    $scope.timeSheetIndex = function() {
      TimesheetsService.timeSheetIndex($state.params.employee_id, accessToken);
    };

    //Success listener: Get time sheet lists.
    $scope.$on('TimesheetsService.timeSheetIndex', function(event, response) {
      $scope.timesheets = response.timesheets;
    });

    // Failure Listerner: not able to get timesheets.
    $scope.$on('TimesheetsService.timeSheetIndexError', function() {
      console.log('waht goins on!');
    });
    // ----------  END - gets Timesheet lists for index page  ---------- //

    
    // ----------  Create timesheet form page  ---------- //
    $scope.createForm = function() {   
      var id = ($state.userId === undefined || $state.userId === null) ? 1 : $state.userId;
      TimesheetsService.createForm(id, accessToken);
    };

    
    $scope.$on('TimesheetsService.createForm', function(event, response) {
      $scope.fields = response.timesheet.fields;
      $scope.timesheet.employee_id = response.employee_id;
    });
    

    // Form submit action to create a new timesheet
    $scope.create = function create(){
      // Applies access token to the form model
      $scope.timesheet.access_token = accessToken;
      // Calls service with the new timesheet model to be created.
      TimesheetsService.submitForm($scope.timesheet);
    };

    //Success listener: New Company created
    $scope.$on('TimesheetsService.submitForm', function(event, response) {
      $scope.timesheetId = response.timesheet.id;
      $state.go('timesheets.show', {timesheetId: $scope.timesheetId});
    });

    // Failure Listerner: New timesheet had validation errors.
    $scope.$on('TimesheetsService.submitFormError', function(event, response) {
      $scope.errors.messages = JSON.parse(response.data.messages);
      // Match up the errors returned with the form name attributes to show erros in the UI.
      for (var message in $scope.errors.messages) {
        for (var field in $scope.fields) {
          if ($scope.fields[field].name === message) {
            $scope.fields[field].error = $scope.errors.messages[message][0];
          }
        }
      }
    });
    // ----------  END - Create timesheet form page  ---------- //

    // ----------  Gets show data for page  ---------- //
    $scope.getLineItems = function() {
      $scope.tab = 0;
      TimeSheetItemService.getLineItems($state.params.timesheetId);
    };
    
    $scope.$on('TimeSheetItemService.getLineItems', function(event, response) {
      $scope.timesheet = response.timesheet;
      $scope.selectTab($scope.tab,$scope.timesheet.dates[0]);
    });


    // ----------  Adds new line item and updates page  ---------- //
    $scope.addLineItem = function() {
      $scope.newItem.client = 'tester';
      $scope.newItem.billing_rate = 10;
      $scope.newItem.billing_on = 10;
      $scope.newItem.access_token = Session.getToken();
      TimeSheetItemService.newLineItem($scope.newItem, $state.params.timesheetId);
    };

    $scope.$on('TimeSheetItemService.newLineItem', function() {
      TimeSheetItemService.getLineItems($state.params.timesheetId);
      $scope.newItem = {}
    });

    $scope.$on('TimeSheetItemService.newLineItemError', function(event, response) {
      $scope.errors = JSON.parse(response.data.messages);
    });

    // ----------  Deletes a line item and updates page  ---------- //
    $scope.deleteLineItem = function(id) {
      TimeSheetItemService.deleteLineItem(id);
    };

    $scope.$on('TimeSheetItemService.deleteLineItem', function() {
      TimeSheetItemService.getLineItems($state.params.timesheetId);
    });

    $scope.$on('TimeSheetItemService.deleteLineItemError', function() {
      TimeSheetItemService.getLineItems($state.params.timesheetId);
    });
    

    // ----------  Pop up date helpers  ---------- //
    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    // ----------  Tab functions  ---------- //
    $scope.total = 0;
    $scope.tab = 0;

    $scope.selectTab = function(newTab, newDate){
      $scope.newItem.billable_on = newDate.fullDate;
      $scope.tab = newTab;
    };

  });

