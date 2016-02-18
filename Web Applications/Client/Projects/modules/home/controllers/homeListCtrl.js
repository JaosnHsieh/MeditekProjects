var app = angular.module('app.authentication.home.list.controller', []);

app.controller('homeListCtrl', function($scope, $cookies, $state, WAAppointmentService,toastr) {
    $scope.UserRole = $cookies.getObject('userInfo').roles[0].RoleCode;
    $scope.checkRole = false;
    if ($scope.UserRole == 'PATIENT') {
        $scope.checkRole = true;
    };
    $scope.info = {
        data: {
            Limit: 1,
            Offset: 0,
            Filter: [{
                Appointment: {
                    Enable: 'Y',
                    FromTime: null
                }
            }],
            Order: [{
                Appointment: {
                    CreatedDate: 'DESC'
                }
            }]
        }
    };
    var today = new Date();
    $scope.info.data.Filter[0].Appointment.FromTime = moment(today).format('YYYY-MM-DD HH:mm:ss Z');
    $scope.ListTodayConsultation = function(data) {
        if (data == 'todaylist') {
            $state.go("authentication.consultation.list", {
                roleid: 'roleid'
            });
        } else if (data == 'today') {
            WAAppointmentService.loadListWAAppointment($scope.info.data).then(function(response) {
                console.log("response data",response);
                if (response.rows.length != 0) {
                    var dataPost = {
                        UID: response.rows[0].UID,
                        UIDPatient: response.rows[0].Patients[0].UID
                    };
                    $state.go("authentication.consultation.detail", {
                        UID: dataPost.UID,
                        UIDPatient: dataPost.UIDPatient
                    });
                } else {
                    toastr.success('There is no consultation today!');
                }

            });
        } else {
            $state.go("authentication.consultation.list");
        };

    }
});
