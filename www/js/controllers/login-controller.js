'use strict';

angular.module('fMMobileApp')
.controller('LoginCtrl',['$scope','$http','$state','authService','userService',function($scope,$http,$state,authService,userService){
  $scope.error ='';
  $scope.errorMessage = false;
  
  $scope.showErrorMessage = function (data,message) {
    if(data === true){
      $scope.error = message;
    }

    $scope.errorMessage = data;
  };

  $scope.logIn = function (guestData) {
    authService.login('/mobile/login',guestData).success(function (data) {
        var status = data.status;
        console.log("User Return");
        console.log(data.status);
        if(status.code === 1) {
          authService.setToken(data.token);
         userService.getUser().success(function (data) {
           $state.go('loadIn');  
         });   
        }else{
          // $scope.error = status.message;
	      //$scope.showError = true;
        console.log(status.message);
	      $scope.showErrorMessage(true,status.message);
        }

	  }).error(function (error) {
        console.log(error);
	  })
  };
}]);
