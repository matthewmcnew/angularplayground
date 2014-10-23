'use strict';

var underscore = angular.module('underscore', []);

underscore.factory('_', function() {
	
	var _ = window._;
	_.getDatesBetween = function( d1, d2 ){
		var weekday = new Array(7);
		weekday[0]=  'Sun';
		weekday[1] = 'Mon';
		weekday[2] = 'Tues';
		weekday[3] = 'Wed';
		weekday[4] = 'Thur';
		weekday[5] = 'Fri';
		weekday[6] = 'Sat';
		var oneDay = 24*3600*1000;
		d2 = (d2*1) + oneDay;
		
		for (var d=[],ms=d1*1,last=d2*1;ms<last;ms+=oneDay){	
			var date = new Date(ms);
			d.push( {
				d: date,
				fullDate: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
				day: weekday[date.getDay()], 
				date: date.getDate(), 
				month: date.getMonth()+1
				} ); 
		}
		return d;
		
	};

	return _; // assumes underscore has already been loaded on the page
});
