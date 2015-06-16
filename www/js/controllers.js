'use strict';

angular.module('FMApp.controllers', [])

.controller('MainCtrl',['$scope','userService','authService','$ionicActionSheet','$state','$rootScope','$filter'
  ,function($scope,userService,authService,$ionicActionSheet,$state,$rootScope,$filter){
   userService.getUser().success(function(data){
    $scope.userId = data.id
    $scope.userType =  data.type;
    $scope.userFirstName = data.firstname;
    $scope.userLastName = data.lastname;
    $scope.userName = $scope.userFirstName + " " + $scope.userLastName;
    console.log($scope.userName);
   });

   $scope.dateToday = new Date();

   $rootScope.$on("firstName",function(){
    console.log("Firstname");
     $scope.userFirstName = userService.getFirstName();
     console.log($scope.userFirstName);
     $scope.$digest();
  });
  
  $rootScope.$on("lastName",function(){
    console.log("lastname");
     $scope.userLastName = userService.getLastName();
     console.log($scope.userLastName);
     $scope.$digest();
  });

  $scope.socketOptions = function (method,url,headers,params) {
    return {
      method: method,
      url: url,
      headers: headers,
      params: params
    };
  };

  $scope.formatDate = function (passedDate) {
    return $filter('date')(passedDate,'yyyy-MM-dd');
  };

  $scope.sortData = function(data,predicate){
    console.log("Data Sort");
    return $filter('orderBy')(data,predicate);
  };

  $scope.logout =function () {
    authService.logout();
    $state.go('login');
  }

  $scope.showSettings  = function () {
    console.log("Show settings");
    $ionicActionSheet.show({
     buttons: [
       { text: 'Edit Account'},
       {text: 'Log Out'}
     ],
     titleText: 'SETTINGS',
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       if(index === 0){
         $state.go('editAccount');
       }else{
         authService.logout();
         $state.go('login');
       }
     }
   });
  };

}]);