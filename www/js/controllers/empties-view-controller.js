'use strict';

angular.module('FMApp.controllers')
.controller('EmptiesViewCtrl',['$scope','$http','$state','authService','httpHost','_',
  '$stateParams','$timeout','$filter','$cordovaDatePicker',function($scope,$http,$state,authService,httpHost,_,$stateParams,$timeout,$filter,$cordovaDatePicker){
  $scope.deliveries = [];
  $scope.returns = [];
  $scope.empties = {};
  $scope.empties.deposit = 0;
  var deliveryID = $stateParams.deliveryID;
  
  var getDeliverySelected = function () {
    $http.get(httpHost + "/delivery/list?id="+ deliveryID).success( function (data) {
      $scope.deliveries = data;
        console.log("Delivery Transaction Selected:");
        console.log($scope.deliveries);
        console.log(deliveryID);
    }).error(function (err) {
      console.log(err);
    });
  };



  getDeliverySelected();

  
    $scope.submit = function (returns) {
    console.log($scope.deliveries);
    for(var i = 0 ; i < returns.length; i++){
      console.log(i);
      // console.log($scope.deliveries[i].products[0].sku_id.id);
      console.log($scope.deliveries[i].products[0].sku_id.id);
      returns[i].sku_id = $scope.deliveries[i].products[0].sku_id.id;
      returns[i].sku_name = $scope.deliveries[i].products[0].sku_id.sku_name+" "+ $scope.deliveries[i].products[0].sku_id.size;
      returns[i].bottlespercase = $scope.deliveries[i].products[0].sku_id.bottlespercase;
    }
    console.log(returns);
    console.log($scope.empties.deposit);
    var returnsInfo = {
      "returns":returns, 
      "deposit": $scope.empties.deposit, 
      "deliveryId": parseInt(deliveryID) 
    };

     console.log(returnsInfo);
 

  io.socket.request($scope.socketOptions('post','/delivery/empties',{"Authorization": "Bearer " + authService.getToken()},returnsInfo), 
    function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        // $scope.bays.push(body);
          $state.go('empties');
          $scope.returns = {};
          $scope.empties.deposit = 0;
        $scope.$digest();
      }
  }); 
   };
  
}]);
