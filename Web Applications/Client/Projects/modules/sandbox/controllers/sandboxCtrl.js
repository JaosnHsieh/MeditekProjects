var app = angular.module('app.authentication.sandbox.controller',[
	'app.authentication.sandbox.privateForm.controller',
	'app.authentication.sandbox.workersComp.controller',
	'app.authentication.sandbox.dragTable.controller',
]);

app.controller('sandboxCtrl', function(){
	console.log('sandboxCtrl');
});