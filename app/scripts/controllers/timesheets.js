'use strict';

angular.module('projectxApp')
  .controller('TimesheetsCtrl', function ($scope, $state, Session, TimesheetsService, TimeSheetItemService) {
    $scope.timesheet = {};
    $scope.newItem = {};
    $scope.item_project = '';
    $scope.item_description = '';
    $scope.item_hours = 0;
    $scope.errors = {};
    $scope.route = {};
    
    // ---------- Page routing ----------//
    $scope.route.index = function() {
      $state.go('timesheets.index', {employee_id: $scope.timesheet.employee_id});
    };
    $scope.route.show = function() {
      $state.go('timesheets.show', {timesheet_id: $scope.timesheet_id, employee_id: $scope.employee_id});
    };
    $scope.route.new = function() {
      $state.go('timesheets.new', {employee_id: $state.params.employee_id});
    };

    // ----------  Gets Timesheet lists for index page  ---------- //
    $scope.timeSheetIndex = function() {
      TimesheetsService.timeSheetIndex($state.params.employee_id);
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

    $scope.createNewTimeSheet = function() {
      $scope.route.new();
    };
    
    // ----------  Create timesheet form page  ---------- //
    $scope.createForm = function() {   
      TimesheetsService.createForm($state.params.employee_id);
    };

    
    $scope.$on('TimesheetsService.createForm', function(event, response) {
      $scope.fields = response.timesheet.fields;
      $scope.timesheet.employee_id = response.employee_id;
    });
    

    // Form submit action to create a new timesheet
    $scope.create = function create(){
      $scope.timesheet.employee_id = $state.params.employee_id;
      // Calls service with the new timesheet model to be created.
      TimesheetsService.submitForm($scope.timesheet);
    };

    //Success listener: New Company created
    $scope.$on('TimesheetsService.submitForm', function(event, response) {
      $scope.timesheet_id = response.timesheet.id;
      $scope.employee_id = response.timesheet.employee_id;
      $scope.route.show();
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
      TimeSheetItemService.getLineItems($state.params.timesheet_id);
    };
    
    $scope.$on('TimeSheetItemService.getLineItems', function(event, response) {
      $scope.timesheet = response.timesheet;
      $scope.selectTab($scope.tab,$scope.timesheet.dates[$scope.tab]);
    });


    // ----------  Adds new line item and updates page  ---------- //
    $scope.addLineItem = function() {
      $scope.newItem.client = 'tester';
      $scope.newItem.billing_rate = 10;
      $scope.newItem.billing_on = 10;
      TimeSheetItemService.newLineItem($scope.newItem, $state.params.timesheet_id);
    };

    $scope.$on('TimeSheetItemService.newLineItem', function() {
      TimeSheetItemService.getLineItems($state.params.timesheet_id);
      $scope.newItem = {};
    });

    $scope.$on('TimeSheetItemService.newLineItemError', function(event, response) {
      $scope.errors = JSON.parse(response.data.messages);
    });

    // ----------  Deletes a line item and updates page  ---------- //
    $scope.deleteLineItem = function(id) {
      TimeSheetItemService.deleteLineItem(id);
    };

    $scope.$on('TimeSheetItemService.deleteLineItem', function() {
      TimeSheetItemService.getLineItems($state.params.timesheet_id);
    });

    $scope.$on('TimeSheetItemService.deleteLineItemError', function() {
      TimeSheetItemService.getLineItems($state.params.timesheet_id);
    });

    // ----------  Submits timesheet for approval  ---------- //
    $scope.submitTimeSheet = function() {
      TimesheetsService.submitTimeSheet($state.params.timesheet_id, $scope.timesheet.employee_id);
    };

    $scope.$on('TimesheetsService.submitTimeSheet', function() {
      $scope.route.index();
    });

    $scope.$on('TimesheetsService.submitTimeSheetError', function() {
      $scope.TimeSheetSubmitError = 'We can\'t process this right now.';
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

