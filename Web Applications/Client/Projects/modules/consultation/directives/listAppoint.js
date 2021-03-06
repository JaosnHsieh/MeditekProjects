var app = angular.module('app.authentication.consultation.directives.listAppoint', []);
app.directive('listAppoint', function(WAAppointmentService, BookingService, $modal, $cookies, toastr, $state, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAppoint.html",
        link: function(scope) {


            scope.info = {
                apptStatus: WAConstant.apptStatus,
                paging: {
                    currentPage: 1,
                    itemsPerPage: 20,
                    maxSize: 10
                },
                data: {
                    Limit: 20,
                    Offset: 0,
                    Filter: [{
                        Appointment: {
                            Status: null,
                            Enable: 'Y',
                            CreatedDate: null,
                            FromTime:null
                        }
                    }, {
                        Patient: {
                            UID: null
                        }
                    }],
                    Search: [{
                        Patient: {
                            FullName: null
                        }
                    },{
                        Doctor: {
                            FullName: null
                        }
                    },{
                        Appointment:{
                            Code:null
                        }
                    }],
                    Range: [{
                        Appointment: {
                            CreatedDate: [null, null],
                            FromTime: [null, null]
                        }
                    }],
                    Order: [{
                        Appointment: {
                            CreatedDate: 'DESC'
                        }
                    }]
                },
                listWaapointment: null,
                toggle: false
            };
            var userRole = 0;
            if (typeof $cookies.getObject('userInfo')) {
                userRole = $cookies.getObject('userInfo').roles;
                _.forEach(userRole, function(role_v, role_i){
                    if(role_v.RoleCode=='INTERNAL_PRACTITIONER')
                        scope.info.data.Filter.push({
                            Doctor: {
                                UserAccountID:$cookies.getObject("userInfo").ID
                            }
                        });
                });
            }
            if ($stateParams.roleid == 'roleid') {
                var today = new Date();
                scope.info.data.Filter[0].Appointment.FromTime = moment(today).format('YYYY-MM-DD 00:00:00 Z');
            }
            scope.toggleFilter = function() {
                scope.info.toggle = scope.info.toggle === false ? true : false;
            };
            scope.WAAppointmentDetail = function(UID) {
                o.loadingPage(true);
                WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
                    console.log('responseData', data);
                    o.loadingPage(false);
                    $modal.open({
                            templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
                            controller: 'WAAppointmentListDetailCtrl',
                            windowClass: 'app-modal-window',
                            resolve: {
                                data: function() {
                                    return data.data;
                                }
                            }
                        })
                        .result.then(function(responseData) {
                            if (responseData == 'success') {
                                scope.LoadData();
                            };
                        }, function(data) {})
                }, function(error) {
                    o.loadingPage(false);
                    toastr.error("Select error!", "error");
                })

            };
            scope.Detail = function(data) {
                var dataPost = {
                    UID: data.UID,
                    UIDPatient: (data.Patients.length == 0) ? 'e.x.ex' : data.Patients[0].UID
                };
                if (data.Patients.length !== 0) {
                    $state.go("authentication.consultation.detail", {
                        UID: dataPost.UID,
                        UIDPatient: dataPost.UIDPatient
                    });
                } else {
                    toastr.error('Please link Patients');
                };
            };

            scope.LoadData = function() {
                o.loadingPage(true);
                WAAppointmentService.loadListWAAppointmentConsultation(scope.info.data).then(function(data) {
                    console.log('aaaaaaaa', scope.info.data);
                    for (var i = 0; i < data.rows.length; i++) {
                        if(!_.isEmpty(data.rows[i].Doctors))
                        {
                            var name='';
                            for (var j = 0; j < data.rows[i].Doctors.length; j++) {
                                var doctor = data.rows[i].Doctors[j];
                                if(doctor.Title)
                                {
                                    name = name + doctor.Title + ' ';
                                }
                                if(doctor.FirstName)
                                {
                                    name = name + doctor.FirstName + ' ';
                                }
                                if(doctor.LastName)
                                {
                                    name = name + doctor.LastName;
                                }
                                if(j < data.rows[i].Doctors.length-1)
                                {
                                    name = name + '; '
                                }

                            }
                            data.rows[i].DoctorsName = name;
                            o.loadingPage(false);
                        }
                    }
                    scope.info.listWaapointment = data;
                    o.loadingPage(false);
                });
            };
            scope.LoadData();
            scope.reloadData = function() {
                scope.info.data.Offset = (scope.info.paging.currentPage - 1) * scope.info.paging.itemsPerPage;
                (scope.info.data.Search[0].Patient.FullName !== "") ? scope.info.data.Search[0].Patient.FullName: scope.info.data.Search[0].Patient.FullName = null;
                (scope.info.data.Search[1].Doctor.FullName !== "" && scope.info.data.Search[1].Doctor.FullName !== undefined) ? scope.info.data.Search[1].Doctor.FullName: scope.info.data.Search[1].Doctor.FullName = null;
                (scope.fromCreateDate && scope.fromCreateDate !== null) ? scope.info.data.Filter[0].Appointment.CreatedDate = moment(scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): scope.info.data.Filter[0].Appointment.CreatedDate = null;
                console.log('scope.info.data', scope.info.data);
                scope.LoadData();
            };
            scope.ClearSearch = function(){
                scope.info.data.Filter[0].Appointment.Code = null;
                scope.info.data.Search[0].Patient.FullName = null;
                scope.info.data.Search[1].Doctor.FullName = null;
                scope.info.data.Filter[0].Appointment.Type = null;
                scope.info.data.Filter[0].Appointment.CreatedDate = null
                scope.fromCreateDate=null;
                scope.info.data.Filter[0].Appointment.Status = null;
                scope.LoadData();
            };

            scope.updateStatus = function(appt) {
                o.loadingPage(true);
                // console.log("appt ",appt);
                var data = {
                    "Appointment": {
                        UID: appt.UID,
                        Status: appt.Status,
                    }
                };
                BookingService.ChangeStatusBooking(data)
                .then(function(response) {
                    toastr.success('Update Status Successfully.');
                    o.loadingPage(false);
                }, function(err) {
                    o.loadingPage(false);
                    console.log("err ",err);
                })
            };
            scope.hightLight = function(status){
                var r = '';
                switch (status) {
                    case 'Not Attended': r = 'red'; break;
                    case 'Attended': r = 'green'; break;
                    default: r = '';
                }
                return r;
            };
        }
    };
})
