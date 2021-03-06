var app = angular.module('app.authentication.company.user.directive',[]);

app.directive('companyUser', function($uibModal, $timeout, $state, companyService, toastr){
	return {
		restrict: 'E',
		scope:{
			uid :'=onUid',
			compuid:'=onComp',
			type:'=onType',
			loadagain:'=onLoadAgain',
			cancel:'=onCancel',
			reset:'=onReset',
			compid:'=onCompid',
			ishaveusername:'=isHaveUsername'
		},
		templateUrl: 'modules/company/directives/templates/companyUserDirective.html',
		link: function(scope, elem, attrs){
			console.log(scope.ishaveusername);
			console.log(scope);
			scope.data = {};
			console.log(scope.uid," ",scope.type);
			if(scope.uid != null && scope.uid != '' && scope.type == 'update') {
				companyService.loadDetail({model:'UserAccount',UID:scope.uid})
				.then(function(response) {
					console.log(response);
					scope.data = response.data;
				},function(err) {
					console.log(err);
				});
			}
			scope.click = function() {
				if (scope.type == 'create') {
					companyService.create({info:scope.data, CompanyUID:scope.compuid, model:'UserAccount',association:true})
					.then(function(response) {
						console.log(response);
						toastr.success("Create Successfully","success");
						scope.cancel();
						scope.loadagain();
					},function(err) {
						console.log(err);
						toastr.error("Please check information","error");
					});
				}
				else if (scope.type == 'delete') {
					// scope.data.Enable = 'N';
					var arrRole = scope.uid.UserAccount.Roles;
					scope.data.RoleId = arrRole.filter(function(el){
						return el.RelUserRole.RoleId == 6;
					});
					console.log(scope.data.RoleId)
					scope.data.Enable = scope.uid.Enable=='Y'?'N':'Y';
					companyService.changestatus({whereClauses:{RoleId:6,UserAccountId:scope.uid.UserAccountID},info:{Enable:scope.data.Enable}, model:'RelUserRole'})
					.then(function(response) {
						console.log(response);
						toastr.success("Delete Successfully","success");
						scope.cancel();
						scope.loadagain();
					},function(err) {
						console.log(err);
						toastr.error("Delete Error","error");
					});
				}
				else {
					console.log("type error");
				}
			}

		},
	};
});