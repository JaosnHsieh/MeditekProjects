var app = angular.module("app.authentication.consultation.drawing.controller",[
]);

app.controller('drawingCtrl', function($scope){
	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle == true ? false : true;
	};
});