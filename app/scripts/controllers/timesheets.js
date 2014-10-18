'use strict';

angular.module('projectxApp')
  .controller('TimesheetsCtrl', function ($scope, $http, $state, ENV, $q, Session) {

    var accessToken = Session.getToken();
    // $scope.days =[ 'Sun','Mon','Tue','Wed','Thu','Fri', 'Sat']
    this.tab = 1;

    $scope.timesheet = {

    };

    $scope.lineItem = {

    };
    this.selectTab = function(newValue){
      this.tab = newValue;
    };

    this.isSelected = function(tabName){
      return this.tab === tabName;
    };

    // pass count of line items into row
    this.rows = ['Row 1', 'Row 2'];
  
    this.counter = 3;
    
    this.addRow = function() {
      
      this.rows.push('Row ' + this.counter);
      this.counter++;
    }

    $http.get(ENV.apiEndpoint + 'api/employees/10/timesheets/new?access_token=' + Session.getToken())
        .then(
          function (response) {
            $scope.fields = response.data.timesheet.fields;
            $scope.line_time = response.data.timesheet.line_item.fields;
            $scope.links = response.data.links;
          }
        );

  });

