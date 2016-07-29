var app = angular.module("app.authentication.notification.private.detail.controller", []);

app.controller('notificationPrivateDetailCtrl', function($scope, $modalInstance, data, $cookies, notificationServices) {
    var userInfo = $cookies.getObject('userInfo');
    $scope.data = data;
    $scope.submitText = '';

    $scope.cancel = function() {
        $modalInstance.close('cancel');
    };

    if (userInfo.UID === data.SenderUID) {
        if (data.Status === 'HANDLED') {
            $scope.submitText = 'Remove';
        } else if (data.Status === 'DELAY') {
            $scope.submitText = 'Stop';
        }
    };

    $scope.submit = function() {
        var textShow = '';
        if ($scope.submitText === 'Remove') {
            textShow = 'You will remove this data in nofication list for receiver!';
        };
        if ($scope.submitText === 'Stop') {
            textShow = 'You will turn off nofication to receiver!';
        };
        swal({
            title: "Are you sure?",
            text: textShow,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if (isConfirm) {
                var info = {
                    ID: data.ID,
                    Enable: 'N'
                };
                notificationServices.ChangeEnableQueueJob(info).then(function(info) {
                    $modalInstance.close('close');
                });
            };
            swal.close();
        });
    };
});
