var app = angular.module('app.authentication.consultation.directives.listAppConsultation', []);
app.directive('listappConsultation', function(consultationServices, $modal, $cookies,$state,$stateParams) {
    return {
        scope:{
            uid:"="
        },
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAppConsultationDirective.html",
         link: function(scope, ele, attr) {

            var Init = function() {
                scope.searchObject = {
                    Limit: 10,
                    Offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    Filter: [{
                        Appointment: {
                            Enable: 'Y'
                        }
                    }, {
                        TelehealthAppointment: {
                            Type: 'TEL'
                        }

                    }],
                    Order: [{
                        Appointment: {
                            CreatedDate: 'DESC',
                            FromTime: null
                        }
                    }],
                    Search: [{
                        PatientAppointment: {
                            FullName: null
                        }
                    }, {
                        Doctor: {
                            FullName: null
                        }
                    }],
                    Range: [{
                        Appointment: {
                            CreatedDate: [null, null],
                            FromTime: [null, null]
                        }
                    }]
                };
                scope.searchObjectMap = angular.copy(scope.searchObject);
                scope.load();
            };
            scope.Status = {
                apptStatus: Consualtation.apptStatus
            }
            scope.SetPage = function() {
                scope.searchObjectMap.Offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.Limit;
                scope.load();
            };
            scope.load = function() {
                o.loadingPage(true);
                scope.searchObjectMapTemp = angular.copy(scope.searchObjectMap);
                consultationServices.listConsultation(scope.searchObjectMapTemp).then(function(response) {
                    o.loadingPage(false);
                    console.log(response);
                    scope.consultation = response.rows;
                    scope.CountRow = response.count;
                });
            }
            Init();
            scope.toggle = true;
            scope.Detail = function(uid) {
                $state.go("authentication.consultation.detail",{UID:uid});
            };
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };
        }
    };
})