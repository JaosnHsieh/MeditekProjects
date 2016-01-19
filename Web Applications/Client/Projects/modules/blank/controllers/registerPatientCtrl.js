var app = angular.module('app.blank.registerPatient.controller', []);
app.controller('registerPatientCtrl', function($scope, blankServices, AuthenticationService, toastr, $state, $cookies, $rootScope) {
    ComponentsDropdowns.init();
    $scope.number = 1;
    $scope.submitted = false;
    $scope.ListContry = [];
    $scope.logInData = {
        UserName: 'emty',
        Password: 'emty',
        UserUID: "",
        PinNumber: ""
    }
    $scope.loadListContry = function() {
        AuthenticationService.getListCountry().then(function(response) {
            $scope.ListContry = response.data;
        });
    }
    $scope.loadListContry();
    $scope.Next = function(number) {
        $scope.submitted = true;
        if ($scope.step1.$valid && number == 1) {
            blankServices.checkpatient({
                PhoneNumber: $scope.postData.data.PhoneNumber
            }).then(function(response) {
                if (!response.data.isCreated) {
                    $scope.number++;
                    $scope.submitted = false;
                } else {
                    toastr.error("Mobile Phone Number exits");
                }
            }, function(err) {
                console.log(err.data.message);
            })
        } else if ($scope.step2.$valid && number == 2) {
            $scope.number++;
            $scope.submitted = false;
            if ($scope.NextOfKin == 'N') {
                if ($scope.postData.otherData.PatientKin) {
                    $scope.postData.otherData.PatientKin = {};
                };
            };
        }
    };
    $scope.Back = function() {
        $scope.submitted = true;
        if ($scope.step1.$valid || $scope.step2.$valid) {
            $scope.number--;
        }
    };
    $scope.Submit = function() {
        $scope.submitted = true;
        if ($scope.step3.$valid) {
            blankServices.registerPatient($scope.postData).then(function(response) {
                if (response.data.status = 200) {
                    $scope.logInData.UserUID = response.data.UserAccountUID;
                    $scope.logInData.PinNumber = $scope.postData.data.PinNumber;
                    blankServices.login($scope.logInData).then(function(response) {
                        $cookies.putObject("userInfo", response.user);
                        $cookies.put("token", response.token);
                        $rootScope.refreshCode = response.refreshCode;
                        $state.go("authentication.patient.home")
                    }, function(err) {
                        toastr.error('Patient login fail');
                    })
                };
            }, function(err) {
                toastr.error('Create Patient fail');
            })
        }
    };
});
