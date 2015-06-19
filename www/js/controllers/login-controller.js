'use strict';

angular.module('FMApp.controllers')
.controller('LoginCtrl',['$scope','$http','$state','authService','userService',function($scope,$http,$state,authService,userService){
  $scope.errorMessage ='';
  $scope.hasError = false;
  
  $scope.showErrorMessage = function (data,message) {
    $scope.hasError = data;
    if(data === true){
      $scope.errorMessage = message;
    }
  };

  $scope.logIn = function (guestData) {
    authService.login('/mobile/login',guestData).success(function (data) {
        var status = data.status;
        console.log("User Return");
        console.log(data.status);
        if(status.code === 1) {
          authService.setToken(data.token);
         userService.getUser().success(function (data) {
           $state.go('app.tally');  
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
