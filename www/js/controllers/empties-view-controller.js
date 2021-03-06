'use strict';

angular.module('FMApp.controllers')
.controller('EmptiesViewCtrl',['$scope','$http','$state','authService','httpHost','_',
  '$stateParams','$timeout','$filter','$cordovaDatePicker',
  function($scope,$http,$state,authService,httpHost,_,$stateParams,$timeout,$filter,$cordovaDatePicker){
  $scope.deliveries = [];
  $scope.returns = {};
  $scope.returnsList = [];
  $scope.totalDeposit = 0;
  var deliveryID = $stateParams.deliveryID;
  $scope.maxCases = 0;
  $scope.maxBots = 0;
  $scope.ifMax = false;
  $scope.returns.bottles = 0;
  $scope.returns.cases = 0;
  
  var getDeliverySelected = function () {
    $http.get(httpHost + "/delivery/list?id="+ deliveryID).success( function (data) {
      $scope.deliveries = $scope.sortData(data[0].products,'sku_id.sku_name');
      $scope.returns.sku = $scope.deliveries[0];
        console.log("Delivery Transaction Selected:");
        $scope.getDeposit($scope.returns.sku);
        $scope.getMaxes($scope.returns.sku);
        console.log($scope.deliveries);
        console.log(deliveryID);
    }).error(function (err) {
      console.log(err);
    });
  };



  getDeliverySelected();
    $scope.combined = function (sku) {
    return sku.sku_id.prod_id.brand_name+ ' ' + sku.sku_id.sku_name + ' ' + sku.sku_id.size;
  }
  

  $scope.addReturns = function (returns) {
    var returnsInfo = {
      "skuObject": returns.sku,
      "sku_id": returns.sku.sku_id.id,
      "sku_name": $scope.combined(returns.sku),
      "bottlespercase": returns.sku.sku_id.bottlespercase,
      "bottles": returns.bottles,
      "cases": returns.cases,
      "deposit": returns.deposit
    };
    $scope.returnsList.push(returnsInfo);
    console.log($scope.returnsList);
    var index = _.findIndex($scope.deliveries,{'id': returns.sku.id});
    $scope.deliveries.splice(index,1);
    $scope.totalDeposit += returnsInfo.deposit;
    console.log($scope.totalDeposit);
    
    clearForm();

  };

  $scope.getDeposit = function(sku){
    $scope.ifMaxCase();
    console.log("SKU");
    console.log(sku);
    var bottles = sku.sku_id.bottlespercase;
    var cases = sku.cases;
    var priceperempty = sku.sku_id.priceperempty;
    console.log(bottles);
    console.log(cases);
    console.log(priceperempty);
    console.log($scope.returns.bottles);
    $scope.returns.deposit = ((cases*bottles)*priceperempty) - ((($scope.returns.cases * bottles)+ $scope.returns.bottles)*priceperempty);
  };

  $scope.getMaxes = function(sku){
    console.log("MAX SKUU");
    console.log(sku);
    $scope.maxCases = sku.cases;
    $scope.maxBots = (sku.sku_id.bottlespercase-1);
    console.log($scope.maxCases);
    console.log($scope.maxBots);
  };

  $scope.ifMaxCase = function (){
    if($scope.returns.cases == $scope.maxCases){
      $scope.ifMax =  true;
      $scope.returns.bottles = 0;
      //$scope.returns.deposit = ((cases*bottles)*priceperempty) - ((($scope.returns.cases * bottles)+ $scope.returns.bottles)*priceperempty);
    }else{
      $scope.ifMax =  false;
      //$scope.returns.bottles =0;
    }
  };

  $scope.deleteReturns = function (index,returns) {
     $scope.deliveries.push(returns.skuObject);
     $scope.deliveries = $scope.sortData($scope.deliveries,'sku_id.sku_name');
    $scope.returns.sku = $scope.deliveries[0];
     $scope.returnsList.splice(index,1);
     $scope.totalDeposit -= returns.deposit;
    console.log($scope.totalDeposit);
  }

  var clearForm = function (){
    $scope.deliveries = $scope.sortData($scope.deliveries,'sku_id.sku_name');
    $scope.returns.sku = $scope.deliveries[0];
    $scope.returns.bottles = null;
    $scope.returns.cases = null;
    $scope.returns.deposit = null;
  }
  
    $scope.submit = function () {
    var returnsInfo = {
      "returns":$scope.returnsList, 
      "deposit": $scope.totalDeposit, 
      "deliveryId": parseInt(deliveryID) 
    };

     console.log(returnsInfo);
 

  io.socket.request($scope.socketOptions('post','/delivery/empties',{"Authorization": "Bearer " + authService.getToken()},returnsInfo), 
    function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        // $scope.bays.push(body);
          $state.go('app.empties');
        $scope.$digest();
      }
  }); 
   };
  
}]);
