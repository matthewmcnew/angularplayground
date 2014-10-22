'use strict';

angular.module('projectxApp').factory('TimeSheetItemService', function Auth(ENV, $resource, $rootScope, Session) {

   // Object to hold resources for companies.
   var _api = {};
   _api.createForm = $resource(ENV.apiEndpoint + 'api/timesheets/1');
   _api.newLineItem = $resource(ENV.apiEndpoint + 'api/timesheets/:timesheet_id/line_items', {timesheet_id: '@timesheet_id'});
   _api.deleteLineItem = $resource(ENV.apiEndpoint + 'api/line_items/:id', {id: '@id'});

	var getDates = function( d1, d2 ){
		var weekday = new Array(7);
		weekday[0]=  'Sun';
		weekday[1] = 'Mon';
		weekday[2] = 'Tues';
		weekday[3] = 'Wed';
		weekday[4] = 'Thur';
		weekday[5] = 'Fri';
		weekday[6] = 'Sat';
		var oneDay = 24*3600*1000;
		for (var d=[],ms=d1*1,last=d2*1;ms<last;ms+=oneDay){	
			var date = new Date(ms);
			d.push( {
				fullDate: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
				day: weekday[date.getDay()], 
				date: date.getDate(), 
				month: date.getUTCMonth()+1
				} ); 
		}
		return d;
		
	};

	var prepareLineItems = function(data) {
		var dates = getDates(new Date(data.timesheet.start_date), new Date(data.timesheet.end_date));
		data.timesheet.dates = dates;
		return data;
	};

   return {
      getLineItems: function() {
         _api.createForm.get({'access_token': Session.getToken()}).$promise.then(function(response) {
            // broadcast success event
            var data = prepareLineItems(response);
            console.log(data);
            $rootScope.$broadcast('TimeSheetItemService.getLineItems', data);      

         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      }, 

      newLineItem: function(item, billable_on) {
      	_api.newLineItem.save({'timesheet_id': 1, 'billable_on': billable_on}, item).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimeSheetItemService.newLineItem', response);      

         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      },

      deleteLineItem: function(id) {
      	_api.deleteLineItem.delete({'id': id}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimeSheetItemService.deleteLineItem', response);      

         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      }
   };
});
