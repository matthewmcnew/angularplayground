'use strict';

angular.module('projectxApp')
  .controller('TimesheetsCtrl', function ($scope, $state, ENV, Session, TimesheetsService, TimeSheetItemService, _) {
    var accessToken = Session.getToken();
    $scope.timesheet = {};
    $scope.item_project = '';
    $scope.item_description = '';
    $scope.item_hours = 0;
    $scope.errors = {};
    
    
    $scope.createForm = function() {   
      var id = ($state.userId === undefined || $state.userId === null) ? 1 : $state.userId;
      TimesheetsService.createForm(id, accessToken); 
    };

    /*
    * Controllers UI update Listeners 
    * These are usually listening for an event fired by a service that also holds
    * data returned from the server.
    * @param event - angular event, should always be the first parameter specified.
    */
    $scope.$on('TimesheetsService.createForm', function(event, response) {
      $scope.fields = response.timesheet.fields;
      $scope.links = response.timesheet.links;
    });
    

    // Form submit action to create a new timesheet
    $scope.create = function create(){
      // Applies access token to the form model
      $scope.timesheet.access_token = accessToken;
      // Calls service with the new timesheet model to be created.
      TimesheetsService.submitForm($scope.timesheet);
    };

    //Success listener: New Company created
    $scope.$on('TimesheetsService.submitForm', function() {
      $state.go('timesheets.show');
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

    /*
    * Dynamically build parts of the form submit url
    * based on the response from the api. 
    * This isn't in use anymore and I need to come back
    * and see what the reasoning was for this.
    */
    $scope.post_link = function() {
      return _.chain($scope.links)
        .filter(function(link) { return link.rel === 'create'; })
        .pluck('href')
        .value();
    };

    // Pop-up dates
    $scope.today = function() {
     $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    // $scope.disabled = function(date, mode) {
    //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    // };


    $scope.createLineItems = function() {
      TimeSheetItemService.getLineItems(userId, accessToken);
    }
    /*
    * Controllers UI update Listeners 
    * These are usually listening for an event fired by a service that also holds
    * data returned from the server.
    * @param event - angular event, should always be the first parameter specified.
    */
    $scope.$on('TimeSheetItemService.getLineItems', function(event, response) {
      $scope.timesheet = response.timesheet;
      $scope.line_items = response.timesheet.line_items;
      
    });
    

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

    this.tab = 1;
    this.total = 0;

    $scope.selectTab = function(newValue){
      this.tab = newValue;
    };

    $scope.isSelected = function(tabName){
      return this.tab === tabName;
    };

    this.line_items = [];
   
    $scope.addLineItem = function() {
      this.line_items.push({ product: $scope.item_project, hours: $scope.item_hours, description: $scope.item_description  });
      this.total = this.total + Number($scope.item_hours)
    };

    

  });

