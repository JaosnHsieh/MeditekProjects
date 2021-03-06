var app = angular.module('app.authentication.roster.calendar.edit.controller',[]);

/*
output variables
	selectedDate
	formData: {
		fromTime
		toTime
	}
*/

app.controller('calendarEditCtrl', function($scope, $stateParams, data, $timeout, $modalInstance, $uibModal, RosterService, toastr){
	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});

	$scope.selectedDate = moment(data.FromTime).format('DD/MM/YYYY');
	var endOccurance = (data.EndRecurrence)?moment(data.EndRecurrence).format('DD/MM/YYYY'):null;
	$scope.formData = {
		service: null,
		site: null,
		fromTime: moment(data.FromTime).format('HH:mm'),
		toTime: moment(data.ToTime).format('HH:mm'),
		IsReoccurance: data.IsRecurrence,
		reoccuranceType: data.RecurrenceType,
		endReoccurance: endOccurance
	};

	function convertToTime24(timeString){
		var split = timeString.split(':');
		return parseInt(split[0]+split[1]);
	};
	function resetReoccurance(){
		$scope.formData.reoccuranceType = '';
		$scope.formData.endReoccurance = null;
	};
	$scope.checkReoccurance = function(IsReoccurance){
		if(IsReoccurance === false){
			resetReoccurance();
		}
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};

	function appendTime(time){
		return (time < 10)?'0'+time:time;
	}

	function appendFullCalendarDateTime(date, time){
		var split_time = time.split(':');
		var hour = appendTime(split_time[0]);
		var minute = split_time[1];
		return moment(date).format('YYYY-MM-DD')+'T'+hour+':'+minute+':00';
	}

	function convertToTimeZone(time){
		var split_time = time.split('/');
		return moment(split_time[2]+'-'+split_time[1]+'-'+split_time[0]).format('YYYY-MM-DD HH:mm:ss Z');
	}

	$scope.submit = function(){
		var service = $scope.formData.service;
		var site = $scope.formData.site;
		var IsReoccurance = $scope.formData.IsReoccurance;
		var reoccuranceType = $scope.formData.reoccuranceType;
		var reoccuranceDate = $scope.formData.endReoccurance;
		var accept = true;

		if(!service){
			toastr.error('Title must be filled');
			accept = false;
		}
		else if(!site){
			toastr.error('Site must be filled');
			accept = false;
		}
		else if($scope.formData.fromTime === ''){
			toastr.error('From Time must be filled');	
			accept = false;
		}
		else if($scope.formData.toTime === ''){
			toastr.error('To Time must be filled');
			accept = false;
		}
		else{
			var fromTimeParse = convertToTime24($scope.formData.fromTime);
			var toTimeParse = convertToTime24($scope.formData.toTime);
			if(fromTimeParse >= toTimeParse){
				toastr.error('From Time must be smaller than To Time !!!');
				accept = false;
			}else{
				var service = $scope.formData.service.UID;
				var site = $scope.formData.site;
				var fromTimeNoTz = moment(data.FromTime).format('YYYY-MM-DD')+' '+appendTime($scope.formData.fromTime);
				var toTimeNoTz = moment(data.FromTime).format('YYYY-MM-DD')+' '+appendTime($scope.formData.toTime);
				var fromTime = moment(fromTimeNoTz).format('YYYY-MM-DD HH:mm:ss Z');
				var toTime = moment(toTimeNoTz).format('YYYY-MM-DD HH:mm:ss Z');
				var IsRecurrence = $scope.formData.IsReoccurance;
				var UserUID = $stateParams.doctorId;
				// var endRecurrence = $scope.formData.endReoccurance;
				var endRecurrence = null;
				var recurrenceType = $scope.formData.reoccuranceType;
				var bookable = $scope.formData.service.Bookable;
				if($scope.formData.IsReoccurance === 'Y'){
					if(endRecurrence === null){
						toastr.error('Please choose End Recurrence');
						accept = false;
					}
					else if(recurrenceType === ''){
						toastr.error('Please choose Recurrence Type');
						accept = false;
					}
					else{
						endRecurrence = convertToTimeZone($scope.formData.endReoccurance);
					}
				}
				var returnData = {
					Roster: {
						UID: data.UID,
						FromTime: fromTime,
						ToTime: toTime,
						IsRecurrence: IsRecurrence,
						EndRecurrence: endRecurrence,
						RecurrenceType: recurrenceType
					},
					UserAccount: {
						UID: UserUID
					},
					Service: {
						UID: service,
						Bookable: bookable
					},
					Site: {
						UID: site
					}
				}
				if(accept){
					RosterService.UpdateRoster(returnData)
					.then(function(response){
						if(response.status === 'overlaps'){
							var modalInstance = $uibModal.open({
					                                    animation: true,
					                                    size: 'md',
					                                    templateUrl: 'modules/roster/views/calendarNotification.html',
					                                    controller: function ($scope, data, $modalInstance) {
					                                    		$scope.data = data;
					                                    		$scope.cancel = function(){
										$modalInstance.dismiss('cancel');
									};
									_.forEach($scope.data, function(item, key){
										$scope.data[key].FromTime = moment(item.FromTime).format('DD/MM/YYYY HH:mm:ss');
										$scope.data[key].ToTime = moment(item.ToTime).format('HH:mm:ss');
									})
					                                    },
					                                    resolve: {
					                                    	data: function(){
					                                    		return response.data;
					                                    	}
					                                    }
					                           });
					                                modalInstance.result
					                                .then(function(result) {
					                                        $scope.events.splice(0, $scope.events.length);
					                                        ServerListCalendar($scope.calendarTemp.startDate,$scope.calendarTemp.endDate);
					                                }, function() {}); 
						}else if(response.status === 'existAppt'){
							toastr.error('Appointment Booking Existed');
						}else{
							toastr.success('Update Booking Successfully');
							$modalInstance.close();
						}
					}, function(error){
					})
				}
			}
		}
	};

	function getListService(){
		RosterService.GetListService()
		.then(function(response){
			$scope.listServices = response.data;
			console.log(data.Services[0]);
			$scope.formData.service = data.Services[0];
		}, function(error){

		})
	}
	function getListSite(){
		RosterService.GetListSite()
		.then(function(response){
			$scope.listSites = response.data;
			$scope.formData.site = data.Sites[0].UID;
		}, function(error){

		})
	}

	getListService();
	getListSite();
});