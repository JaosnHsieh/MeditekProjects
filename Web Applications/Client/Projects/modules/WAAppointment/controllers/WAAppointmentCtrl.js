var app = angular.module('app.authentication.WAAppointment.controller',[
	'app.authentication.WAAppointment.list.controller',
	'app.authentication.WAAppointment.GP.controller',
<<<<<<< HEAD
	'app.authentication.WAAppointment.directives.listWAAppoint',
	'app.authentication.WAAppointment.directives.detailWAAppoint'
=======
	'app.authentication.WAAppointment.services'
>>>>>>> practioner
]);

app.controller('WAAppointmentCtrl', function($scope){
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();
    });
});