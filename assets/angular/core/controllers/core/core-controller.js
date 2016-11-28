angular.module("EmmetBlue")

.controller('coreController', function($scope, $location, $routeParams, CONSTANTS, utils){
	$scope.$on('$routeChangeSuccess', function(event, current, previous){
		var path = ($location.path()).split('/');

		delete path[path.length - 1];

		var moduleMenu = CONSTANTS.TEMPLATE_DIR +
						 path.join('/')+
						 CONSTANTS.MODULE_MENU_LOCATION;
		var moduleHeader = CONSTANTS.TEMPLATE_DIR +
						 path.join('/')+
						 CONSTANTS.MODULE_HEADER_LOCATION;

		$scope.moduleMenu = moduleMenu;
		$scope.moduleHeader = moduleHeader;
	});

	$scope.checkLogin = function(){
		if ($location.path() != '/user/login'){
			utils.userSession.cookie();
		}
	}

	$scope.isAuthPage = function(){
		if ($location.path() == '/user/login'){
			return true;
		}

		return false;
	}

	$scope.logout = function(){
		utils.userSession.clear();
	}

	$scope.checkLogin();
});