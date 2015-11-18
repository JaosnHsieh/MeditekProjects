var app = angular.module('app.unAuthentication.login.controller', []);
app.controller('loginCtrl', function($scope,$rootScope, $state, $cookies, UnauthenticatedService, toastr, $timeout) {
    $scope.showClickedValidation = false;
    $scope.login = function() {
        $scope.showClickedValidation = true;
        $scope.laddaLoading = true;
        if ($scope.loginForm.$invalid) {
            $scope.laddaLoading = false;
            toastr.error("Please Input Your Username And Password!", "Error");
        } else {
            UnauthenticatedService.login($scope.user).then(function(data) {
                if(data.user.Activated == 'Y'){
                    $cookies.putObject("userInfo", data.user);
                    $cookies.put("token", data.token);
                    $rootScope.refreshCode=data.refreshCode;
                    $state.go("authentication.home.list")
                } else {
                    $cookies.putObject("userInfo", {UID: data.user.UID,token:data.token});
                    $state.go('unAuthentication.activation',null,{reload:true});
                }
               
            }, function(err) {
                $scope.laddaLoading = false;
                toastr.error(!err.data.message ? err.data.ErrorType : err.data.message, "Error");
            })
        }
    };
});