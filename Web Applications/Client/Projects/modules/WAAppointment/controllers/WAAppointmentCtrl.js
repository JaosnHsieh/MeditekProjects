var app = angular.module('app.authentication.WAAppointment.controller',[
	'app.authentication.WAAppointment.list.controller',
	'app.authentication.WAAppointment.GP.controller',
]);

app.controller('WAAppointmentCtrl', function($scope){
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();
    });
});