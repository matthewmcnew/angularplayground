'use strict';

angular.module('projectxApp').factory('TimeSheetItemService', function Auth(ENV, $resource, $rootScope, Session, _) {

   // Object to hold resources for companies.
   var _api = {};
   _api.createForm = $resource(ENV.apiEndpoint + 'api/timesheets/1');
   _api.newLineItem = $resource(ENV.apiEndpoint + 'api/timesheets/:timesheet_id/line_items', {timesheet_id: '@timesheet_id'});
   _api.deleteLineItem = $resource(ENV.apiEndpoint + 'api/line_items/:id', {id: '@id'});


	var prepareLineItems = function(data) {
		var dates = _.getDatesBetween(new Date(data.timesheet.start_date), new Date(data.timesheet.end_date));
		data.timesheet.dates = dates;
		return data;
	};

	var getDateTotalHours = function(data) {
		data.timesheet.dates.filter(function(date) {
			date.total = 0;
			data.timesheet.line_items.filter(function(item) {
				if (item.billable_on === date.fullDate) {
					date.total+=Number(item.hours);
				}
			});
		});
		return data;
	};

	var getTimeSheetTotalHours = function(data) {
		data.timesheet.total = 0;
		data.timesheet.line_items.filter(function(item) {
			data.timesheet.total += Number(item.hours);
		});
		return data;
	};

   return {
      getLineItems: function() {
         _api.createForm.get({'access_token': Session.getToken()}).$promise.then(function(response) {
            // broadcast success event
            var data = prepareLineItems(response);
            data = getTimeSheetTotalHours(data);
            data = getDateTotalHours(data);
            $rootScope.$broadcast('TimeSheetItemService.getLineItems', data);      

         }, function(error) {
            // throw error
            throw new Error('There was an error loading the form.', error);
         });
      }, 

      newLineItem: function(item, billable_on) {
      	_api.newLineItem.save(
      		{'timesheet_id': 1, 
      		'billable_on': billable_on, 
      		'access_token': Session.getToken()}, 
      		item).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimeSheetItemService.newLineItem', response);      

         }, function(error) {
            // throw error
            $rootScope.$broadcast('TimeSheetItemService.newLineItemError', error);
         });
      },

      deleteLineItem: function(id) {
      	_api.deleteLineItem.delete({'id': id, 'access_token': Session.getToken()}).$promise.then(function(response) {
            // broadcast success event
            $rootScope.$broadcast('TimeSheetItemService.deleteLineItem', response);      

         }, function(error) {
            // throw error
            $rootScope.$broadcast('TimeSheetItemService.deleteLineItemError', error);
         });
      }
   };
});
