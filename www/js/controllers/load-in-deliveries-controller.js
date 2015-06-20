'use strict';

angular.module('FMApp.controllers')
.controller('LoadInDeliveriesCtrl',['$scope','$http','$state','authService','httpHost',
  '$stateParams',function($scope,$http,$state,authService,httpHost,$stateParams){
  var loadInID = $stateParams.loadInID;
  $scope.deliveries = [];

  $scope.errorMessage ='';
  $scope.hasError = false;
  
  $scope.showErrorMessage = function (data,message) {
    $scope.hasError = data;
    if(data === true){
      $scope.errorMessage = message;
    }
  }

   var getDeliveries = function () {
    $http.get(httpHost + "/delivery/list?loadout="+ loadInID).success( function (data) {
      $scope.deliveries = data;
        console.log("Delivery Transaction:");
        console.log($scope.deliveries);
        console.log(loadInID);
    }).error(function (err) {
      console.log(err);
    });
  };

  getDeliveries();

  $scope.noLoadIn = function (deliveryId){
    console.log(deliveryId);
    var noLoadIn = {
      "loadout": loadInID,
      "delivery": deliveryId
    };
    io.socket.request($scope.socketOptions('post','/load-in/no-loadin',{"Authorization": "Bearer " + authService.getToken()},noLoadIn), function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
         console.log("success");
         $scope.showErrorMessage(true,body.message);
        $state.go('app.load-in');
        $scope.$digest();
      }
    }); 
  }
  
}]);
