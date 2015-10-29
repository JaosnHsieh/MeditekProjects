var app = angular.module('app.authentication.appointment.list.modal.controller', []);
app.controller('showImageController', function($scope, $modalInstance, toastr, LinkUID) {
    $scope.LinkUID = LinkUID
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    $scope.Vieww = function(LinkUID) {
        var newWindow = window.open("");
        newWindow.document.write("<img class='img-responsive' src='" + LinkUID + "'>");
    }
})
app.controller('appointmentListModalCtrl', function($scope, $modal, $modalInstance, getid, AppointmentService, CommonService, $cookies, toastr, PatientService) {

    $modalInstance.rendered.then(function() {
        App.initComponents(); // init core components
        App.initajax();
        ComponentsDateTimePickers.init(); // init todo page
        ComponentsSelect2.init(); // init todo page
        ComponentsBootstrapSelect.init(); // init todo page
        Portfolio.init();
        ComponentsDropdowns.init(); // init todo page
    });
    $scope.ViewDoc = function(Url, UID) {
        var LinkUID = Url + UID
        window.open(LinkUID);
    }
    $scope.modal_close = function() {
        $modalInstance.close();
    };
    $scope.close = function() {
        $modalInstance.close();
    };

    $scope.selectPatient = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../modules/appointment/views/appointmentSelectPatientModal.html',
            controller: function($scope, $modalInstance) {
                $scope.patient = {
                    runIfSuccess: function(data) {
                        $modalInstance.close({
                            status: 'success',
                            data: data
                        });
                    }
                };
            },
            windowClass: 'app-modal-window',
            resolve: {
                patientInfo: function() {
                    PatientService.postDatatoDirective($scope.ShowData.patient);
                }
            }

        });
        modalInstance.result.then(function(data) {
            if (data.status == 'success') {
                $scope.ShowData.isLinkPatient = true;
                var patientUid = data.data.UID;
                AppointmentService.GetDetailPatientByUid({
                    UID: patientUid
                }).then(function(data) {
                    if (data.message == 'success') {
                        $scope.appointment.Patients = [];
                        $scope.ShowData.patient = data.data[0];
                        $scope.ShowData.patient.WorkPhoneNumber = data.data[0].UserAccount.PhoneNumber;
                        $scope.appointment.Patients.push({
                            UID: patientUid
                        });
                        toastr.success("Select patient successfully!", "success");
                    };
                })
            };
        });
    };

    $scope.loadAllDoctor = function() {
        AppointmentService.ListDoctor().then(function(data) {
            $scope.listDoctorTreatingPractitioner = data;
        });
    }

    $scope.loadAllDoctor();

    $scope.selectTreatingPractitioner = function(data) {
        AppointmentService.getDoctorById({
            UID: data
        }).then(function(data) {
            $scope.appointment.Doctors[0] = data[0];
            toastr.success("Select doctor successfully", "Success");
        })
    }

    $scope.Url = AppointmentService.getImage()
    $scope.checkRoleUpdate = true
    $scope.tab_body_part = 'all';
    if ($cookies.getObject('userInfo').roles[0].RoleCode == 'ADMIN' 
        || $cookies.getObject('userInfo').roles[0].RoleCode == 'ASSISTANT' 
        || $cookies.getObject('userInfo').roles[0].RoleCode == 'INTERNAL_PRACTITIONER') {
        $scope.checkRoleUpdate = false
    }

    $scope.ShowData = {
        DateTimeAppointmentDate: null,
        PatientsFullName: null,
        isLinkPatient: false,
        PreferredPractitionersTemp: [],
        patient: []
    }
    $scope.appointment = null
    $scope.Other = {
        LacerationsOther: 'N',
        SkincancerOther: 'N',
        PNSOther: 'N'
    }

    var ClinicalDetails = CommonService.GetClinicalDetails();
    var listDoctor = CommonService.GetNamDoctor();

    var load = function() {
        console.log(getid)
        $scope.Temp = angular.copy(getid)
        $scope.appointment = angular.copy(getid);
        if ($scope.appointment.Patients.length != 0) {
            $scope.ShowData.isLinkPatient = true
            if (checkDateUndefined($scope.appointment.Patients[0])) {
                $scope.ShowData.patient = angular.copy($scope.appointment.Patients[0])
            };
        } else {
            $scope.ShowData.patient = angular.copy($scope.appointment.TelehealthAppointment.PatientAppointment)
        }
        if (checkDateUndefined($scope.appointment.TelehealthAppointment)) {
            $scope.appointment.TelehealthAppointment.ClinicalDetails = {}
            $scope.Temp.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes, indexRes) {
                if (valueRes != null && valueRes != undefined) {
                    var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name
                    keyClinicalDetail = keyClinicalDetail.split(" ").join("__")
                    $scope.appointment.TelehealthAppointment.ClinicalDetails[keyClinicalDetail] = {}
                    $scope.appointment.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].Value = valueRes.Value
                    $scope.appointment.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].ClinicalNote = valueRes.ClinicalNote
                }
            })

            if (checkDateUndefined($scope.appointment.TelehealthAppointment.PatientAppointment.FirstName)) {
                $scope.ShowData.PatientsFullName = $scope.appointment.TelehealthAppointment.PatientAppointment.FirstName + ' ' + $scope.appointment.TelehealthAppointment.PatientAppointment.LastName
            }
            listDoctor.forEach(function(valueInit, indexInit) {
                $scope.appointment.TelehealthAppointment.PreferredPractitioners.forEach(function(valueRes, indexRes) {
                    if (valueInit.Name == valueRes.Name) {
                        valueInit.Value = 'Y'
                    }
                })
            })
            checkOtherInput()
        }
        if (!$scope.ShowData.isLinkPatient) {
            $scope.appointment.TelehealthAppointment.PatientAppointment = $scope.ShowData.patient
        };
        $scope.referringPractitionerDateTemp = formatDate($scope.appointment.Doctors.RefDate);

        if ($scope.appointment.RequestDate) {
            $scope.appointment.RequestDate = formatDate($scope.appointment.RequestDate)
        }

        if (checkDateUndefined($scope.appointment.FromTime)) {
            var DateTime = angular.copy(getid.FromTime);
            $scope.ShowData.DateTimeAppointmentDate = moment(DateTime, "YYYY-MM-DD HH:mm:ss Z").utc().format("DD/MM/YYYY");
            $scope.ShowData.DateTimeAppointmentDateTime = moment(DateTime).utc().format('h:mm:ss A');
            console.log($scope.ShowData.DateTimeAppointmentDate)
        } else {
            $scope.ShowData.DateTimeAppointmentDateTime = null
        }


        $scope.ShowData.PreferredPractitionersTemp = angular.copy(listDoctor);
        // });
    }
    var checkDateUndefined = function(data) {
        if (data == ' ' || data == '' || data == undefined) {
            return false
        }
        return true
    }
    var checkOtherInput = function() {
        if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Lacerations.Others']) 
            && $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Lacerations.Others'].Value) {
            $scope.Other.LacerationsOther = 'Y'
        };
        if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Skin__cancer.Other']) 
            && $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Skin__cancer.Other'].Value) {
            $scope.Other.SkincancerOther = 'Y'
        };
        if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.PNS.Other']) &&
            $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.PNS.Other'].Value) {
            $scope.Other.PNSOther = 'Y'
        };
    }
    var formatDate = function(data) {
        var date = moment(data, "YYYY-MM-DD HH:mm:ss Z").format("DD/MM/YYYY");
        return date
    }
    var formatDateServer = function(data) {
        moment(data, "MM/DD/YYYY HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss Z')
    }
    $scope.appointmentload = {
        load: function() {
            load();
        }
    }
    $scope.appointmentload.load();
    $scope.showImage = function(Link, UID) {
        var LinkUID = Link + UID
        $modal.open({
            templateUrl: 'showImageTemplate',
            controller: 'showImageController',
            windowClass: 'app-modal-window-full',
            resolve: {
                LinkUID: function() {
                    return LinkUID;
                }
            }
        })
    }

    $scope.submitUpdate = function() {
        swal({
                title: "Are you sure ?",
                text: "Update Appointment",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
            function() {
                $scope.updateAppointment();
            });
    }

    $scope.updateAppointment = function() {
        if ($scope.ShowData.DateTimeAppointmentDate != null && $scope.ShowData.DateTimeAppointmentDate != '') {
            var Time = moment($scope.ShowData.DateTimeAppointmentDateTime, ["HH:mm:ss A"]).format("HH:mm:ss");
            var StringAppointmentDateTime = $scope.ShowData.DateTimeAppointmentDate + ' ' + Time + ' Z';
            $scope.appointment.FromTime = moment(StringAppointmentDateTime, "DD/MM/YYYY HH:mm:ss Z").utc().format('YYYY-MM-DD HH:mm:ss Z');
        } else {
            $scope.appointment.FromTime = null
        };
        if ($scope.appointment.Status == "Approved") {
            $scope.appointment.ApprovalDate = moment().format('YYYY-MM-DD HH:mm:ss Z')
        } else {
            $scope.appointment.ApprovalDate = null
        }

        $scope.appointment.UserInfo = {
            UID: $cookies.getObject("userInfo").UID
        }

        var PreferredPractitioners = [];

        $scope.ShowData.PreferredPractitionersTemp.forEach(function(valueRes, indexRes) {
            if (valueRes.Value == "Y") {
                PreferredPractitioners.push(valueRes)
            }
        })
        if (checkDateUndefined($scope.appointment.TelehealthAppointment)) {
            var ClinicalDetailsNote = ''
            $scope.appointment.TelehealthAppointment.PreferredPractitioners = angular.copy(PreferredPractitioners)
            if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Trauma.Dislocation']) &&
                checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails)) {
                ClinicalDetailsNote = $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Trauma.Dislocation'].ClinicalNote
            };
            var ClinicalDetailsTemp = [];
            for (var key in $scope.appointment.TelehealthAppointment.ClinicalDetails) {
                var newkey = key.split("__").join(" ")
                var res = newkey.split(".");
                var object = {
                    Section: res[0],
                    Category: res[1],
                    Type: res[2],
                    Name: res[3],
                    Value: $scope.appointment.TelehealthAppointment.ClinicalDetails[key].Value,
                    ClinicalNote: ClinicalDetailsNote
                }
                var isExist = false
                ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
                    if (valueTemp.Section == object.Section &&
                        valueTemp.Category == object.Category &&
                        valueTemp.Type == object.Type &&
                        valueTemp.Name == object.Name) {
                        isExist = true
                    }
                })
                if (!isExist) {
                    ClinicalDetailsTemp.push(object)
                };
            };
            var countCliniDetail = 0
            ClinicalDetailsTemp.forEach(function(value, key) {
                if (value.Value != 'N' && value.Value != null) {
                    countCliniDetail++
                };
            })
            if (countCliniDetail == 0) {
                ClinicalDetailsTemp = []
            }
            $scope.appointment.RequestDate = moment($scope.appointment.RequestDate, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss Z')
            $scope.appointment.TelehealthAppointment.ClinicalDetails = angular.copy(ClinicalDetailsTemp)
            var postData = {
                    data: $scope.appointment
                }
            AppointmentService.upDateApppointment(postData).then(function(response) {
                if (response == 'success') {
                    $modalInstance.close('success');
                    swal("Success.");
                };

            })
        };
    }
});
