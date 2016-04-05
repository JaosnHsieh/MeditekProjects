var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
    'app.authentication.consultation.directives.consultNoteDirectives'
]);
app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams, AdmissionService, $q, toastr, EFormService) {
    /* EFORM */
    var postData = {
        Filter: [{
            EFormTemplate: {
                Enable: 'Y'
            }
        }, {
            Appointment: {
                UID: $stateParams.UID
            }
        }]
    }
    EFormService.PostListEFormTemplate(postData)
        .then(function(response) {
            $scope.eformTemplates = response.data.rows;
        }, function(error) {

        })

    $scope.eFormTemplate = function(eformTemplate) {
        $state.go("authentication.consultation.detail.eForm.LoadForm", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient, UIDFormTemplate: eformTemplate.UID });
    };

    var userInfo = JSON.parse($cookies.get('userInfo'));
    $scope.checkPatient = 'Y';
    for (var i = 0; i < userInfo.roles.length; i++) {
        var role = userInfo.roles[i];
        if (role.RoleCode === 'INTERNAL_PRACTITIONER' || role.RoleCode === 'ADMIN') {
            $scope.checkPatient = 'Y';
        }
    }

    $scope.styleFunction = function(EForms) {
            var check = false;
            for (var i = 0; i < EForms.length; i++) {
                var EForm = EForms[i];
                var Appointments = EForm.Appointments;
                for (var j = 0; j < Appointments.length; j++) {
                    var Appointment = Appointments[j];
                    if (Appointment.UID === $stateParams.UID) {
                        check = true;
                        break;
                    }
                }
            }
            return (check) ? 'green-jungle' : 'blue-steel';
        }
        /* END EFORM */
        //
    $scope.checkRoleUpdate = true;
    for (var i = 0; i < $cookies.getObject('userInfo').roles.length; i++) {
        if ($cookies.getObject('userInfo').roles[i].RoleCode == 'INTERNAL_PRACTITIONER' || $cookies.getObject('userInfo').roles[i].RoleCode == 'ADMIN') {
            $scope.checkRoleUpdate = false;
        };
    }
    //
    $scope.Params = $stateParams;
    console.log("$scope.Params", $scope.Params.UID);
    $scope.getTelehealthDetail = function(UID) {
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            $scope.wainformation = data.data;
            console.log(" o day wainformation ", $scope.wainformation);
        }, function(error) {

        });
    };

    $scope.getTelehealthDetail($scope.Params.UID);

    /*==addmission star==*/
    $scope.admissionDetail = {};
    $scope.admissionInfo = {
        appointmentAdmission: {
            Filter: [{
                Appointment: {
                    UID: $scope.Params.UID
                },
                Patient: {
                    UID: $scope.Params.UIDPatient
                }
            }],
            Order: [{
                Admission: {
                    ID: 'DESC'
                }
            }]
        },
        patientAdmission: {
            Filter: [{
                Patient: {
                    UID: $scope.Params.UIDPatient
                }
            }],
            Order: [{
                Admission: {
                    ID: 'DESC'
                }
            }]
        }
    }

    function promiseGetListAdmission(data) {
        var deferred = $q.defer();
        AdmissionService.GetListAdmission(data).then(function(data) {
            deferred.resolve(data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function setDetailAdmission(input, output) {
        _.forEach(input, function(value, name) {
            var itemData = null;
            if (value.Name == "PREVIOUS_SURGERY_PROCEDURES" || value.Name == "MEDICATIONS") {
                itemData = JSON.parse(value.Value);
            } else {
                itemData = value.Value;
            };
            output[value.Name] = itemData;
        });
    }

    var apptAdmission = promiseGetListAdmission($scope.admissionInfo.appointmentAdmission);
    apptAdmission.then(function(data) {
            if (data.count > 0) {
                $scope.admissionUID = data.rows[0].UID;
                setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                console.log('updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', data);
                console.log('updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', $scope.admissionDetail);
                return "AdmissionAppointmentExists";
            };
            return "AdmissionAppointmentNotExists";
        })
        .then(function(data) {
            console.log(data)
            if (data == 'AdmissionAppointmentNotExists') {
                promiseGetListAdmission($scope.admissionInfo.patientAdmission).then(function(data) {
                    console.log("1111", data);
                    if (data.count > 0) {
                        setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                        return { message: "AdmissionPatientExists", data: data.rows[0] };
                    };
                    console.log("createeeeeeeeeeeeeeeeeeeeeeeeee");
                    return { message: "AdmissionPatientNotExists" };
                }).then(function(data) {
                    console.log("huuuuuuuuuuuuu",data);
                    var info = {
                        UID: $stateParams.UID,
                        Admissions: [{
                            AdmissionData: (data.message === "AdmissionPatientExists") ? data.AdmissionData : []
                        }]
                    };
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",info);
                    AdmissionService.CreateAdmission(info).then(function(data) {
                        console.log("create admission",data);
                        return "success"
                    }, function(error) {
                        return "error"
                    }).then(function(data) {
                        if (data == "success") {

                        };
                    });
                });
            };
        })
        /*==addmission end==*/
    $scope.eForms = function() {
        $state.go("authentication.consultation.detail.eForm.appointment", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient });
    };
    $scope.admission = function() {
        $state.go("authentication.consultation.detail.admission.detail");
    };
    $scope.consultNote = function() {
        $state.go("authentication.consultation.detail.consultNote");
    };
    $scope.telehealthDetail = function() {
        if ($scope.wainformation.Type == 'Onsite') {
            $state.go("authentication.onsite.appointment", { UID: $scope.wainformation.UID })
        } else {
            $state.go("authentication.consultation.detail.telehealth", { UID: $scope.wainformation.UID });
        }
    };

    var col9 = "col-md-9 col-sm-9";
    var col3 = "col-md-3 col-sm-3";
    $scope.iconCol = "Hide Detail"
    $scope.fullScreen = function() {
        col9 = col9 === "col-md-9 col-sm-9" ? "col-md-12 col-sm-12" : "col-md-9 col-sm-9";
        col3 = col3 === "col-md-3 col-sm-3" ? "hide" : "col-md-3 col-sm-3";
        $scope.iconCol = $scope.iconCol === "Hide Detail" ? "Show Detail" : "Hide Detail";
        angular.element("#col9").attr("class", col9);
        angular.element("#col3").attr("class", col3);
    };
});
