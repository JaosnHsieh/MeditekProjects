var app = angular.module('app.authentication.user.profile.controller',[
]);

app.controller('userProfileCtrl', function($scope, PatientService, doctorService, $cookies, $compile){
	$scope.isShow=true;
	$scope.listDoctor = {
		columm2 : true,
		columm3 : true,
		columm4 : true
	};

	$scope.listPatient = {
		columm1 : true,
		columm2 : true,
		columm3 : true
	};

	var data ={
		// UID : "a75b5a3f-f3c4-4b2b-9eab-95f6a798aacd",
		UID : $cookies.getObject("userInfo").UID,
		attributes: [
			{field:"UID"}
		]
	};
	
	var userprofile = $cookies.getObject("userprofile");
	$scope.user = $cookies.getObject("userprofile");

	if(userprofile.patient!=null){
		PatientService.getPatient(data).then(function(response){
			if(response.message=="Success"){
				$scope.patientUID = response.data[0].UID;
				angular.element(document.getElementById('user-content'))
				.append($compile("<div class='col-md-12'>"+
								"<div class=' portlet light'>"+
			"<patient-listmodal on-uid='patientUID' on-showfull='false'"+
			" on-listshow='listPatient' ng-if='patientUID!=null' on-disabled='true' ></patient-listmodal>"+
			"</div></div>")($scope));
			}
			else
				$scope.patientUID = null;
		},function(err){
			$scope.patientUID = null;
		});
	}
	if(userprofile.doctor!=null){
		doctorService.getDoctor(data).then(function(response){
			$scope.data = response.data;
			$scope.data.UserAccount.UID = $cookies.getObject("userInfo").UID;
			response.data.Speciality = [];
			for(var i = 0; i < response.data.Specialities.length; i++){
				response.data.Speciality.push(response.data.Specialities[i].ID);
			}
			delete response.data['Specialities'];
			doctorService.getSpecialities()
			.then(function(result){
				$scope.special = angular.copy(result.data);
				angular.element(document.getElementById('user-content'))
				.append($compile("<div class='col-md-12'>"+
					"<doctor-detail on-uid='uid' on-data='data' on-showfull='false' on-speciality='special' "+
					"on-listshow='listDoctor' action='action' on-cancel='close'>"+
					"</doctor-detail></div>")($scope));
			},function(err){
				console.log(err);
			});
		},function(err){
			console.log(err);
		});
	}
});