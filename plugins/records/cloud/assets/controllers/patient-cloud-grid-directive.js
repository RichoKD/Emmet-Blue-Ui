angular.module("EmmetBlue")

.directive('ngPatientCloudGrid', function(){
	return {
		restrict: 'AE',
		scope: {
			patientInfo: '=patientInfo'
		},
		templateUrl: "plugins/records/cloud/assets/includes/patient-grid-template.html",
		controller: function($scope, utils, $rootScope){
			$scope.loadImage = utils.loadImage;
			$scope.patients = {};
			$scope.patients[$scope.patientInfo.patientid] = $scope.patientInfo;

			$scope.accountSearch = {};
			$scope.foundAccount = {};

			$scope.findAccount = function(){
				var req = utils.serverRequest("/emmetblue-cloud/patient-profile/retrieve-account-public-info?method="+$scope.accountSearch.method+"&value="+$scope.accountSearch.value, "GET");
				req.then(function(response){
					$scope.foundAccount = response;
				}, function(error){
					utils.errorHandler(error);
					$scope.foundAccount = {};
				})
			}

			$scope.completeLinking = function(){
				var title = "Please Confirm";
				var text = "Do you really want to link this patient to the account identified by: "+$scope.foundAccount.email_address+"?";
				var close = true;
				var type = "warning";
				var btnText = "Yes, please continue";

				var process = function(){
					var data = {
						patient: $scope.patientInfo.patientid,
						accountId: $scope.foundAccount.user_id,
						staff: utils.userSession.getID()
					};

					var req = utils.serverRequest("/emmetblue-cloud/patient-profile/new-link", "POST", data);
					req.then(function(response){
						utils.alert("Operation Successful", "The selected patient has been linked successfully", "success");
						$("#link-patient-"+data.patient).modal("hide");
					}, function(error){
						utils.errorHandler(error);
					});
				}

				utils.confirm(title, text, close, process, type, btnText);
			}
		}
	}
})