'use strict';

angular.module('FMApp.controllers')
.controller('LoadInViewCtrl',['$scope','$http','$state','authService','httpHost',
  '$stateParams','$timeout','$filter','$cordovaDatePicker',function($scope,$http,$state,authService,httpHost,$stateParams,$timeout,$filter,$cordovaDatePicker){
  $scope.products = [];
  var deliveryID = $stateParams.deliveryID;
  var customerID = null;
  var loadOutID = null;
  $scope.bays = [];
  $scope.loadIn = {};
  $scope.loadIns = [];
  $scope.noBays = false;
  

  var getLoadOuts = function () {
    $http.get(httpHost + "/delivery/list?id="+ deliveryID).success( function (data) {
      $scope.deliveries = data;
      $scope.loadIn.product = $scope.deliveries[0].products[0];
      $scope.getBays($scope.loadIn.product);
      customerID = $scope.deliveries[0].customer_id.id;
        console.log("Delivery Transaction Selected:");
        console.log($scope.deliveries);
        console.log(deliveryID);
        console.log("Customer ID:");
        console.log(customerID);
    }).error(function (err) {
      console.log(err);
    });
  };

  // var getBays = function () {
  //   $http.get(httpHost + '/bays/list').success( function (data) {
  //     if(data.length !== 0){
  //     $scope.bays = data;
  //      $scope.loadIn.bay = $scope.bays[0];
  //     console.log("Bays:");
  //     console.log($scope.bays);
  //     }
  //   }).error(function (err) {
  //     console.log(err);
  //   });

  // };

  $scope.getBays = function (sku){
    console.log(sku.id);
    console.log("Get Bays");
     $http.get(httpHost + '/bays/list/sku-lines?id=' + sku.id).success( function (data) {
      console.log(data);
      if(data.length !== 0){
      $scope.bays = $scope.sortData(data,'bay_name');
      $scope.loadIn.bay = $scope.bays[0];        
      console.log("Bays:");
      console.log($scope.bays);
        $scope.noBays =false;
      }else{
        $scope.noBays = true;
      }
    }).error(function (err) {
      $scope.checkError(err);
    });
  };

  var getLoadOutNumber = function () {
    $http.get(httpHost + "/delivery_transactions/"+ deliveryID).success( function (data) {
      loadOutID = data.loadout_id.id;
      console.log("Load Out Number");
      console.log(loadOutID);
    }).error(function (err) {
      console.log(err);
    }); 
  }


    getLoadOuts();
    getLoadOutNumber();


   $scope.bayName = function (bay) {
     return "Bay " + bay.bay_name;
   };

   $scope.prodName = function (sku) {
     return sku.prod_id.brand_name +" "+ sku.sku_name;
   };

   $scope.addLoadIn = function (loadIn){
    console.log(loadIn);
     // var item = {
     //   'sku_id': loadIn.product.sku_id.id,
     //   'cases': loadIn.returns,
     //   'bottlespercase': loadIn.product.sku_id.bottlespercase,
     //   'bay_id': loadIn.bay,
     //   'prod_date': $filter('date')(loadIn.prodDate,'yyyy-MM-dd'),
     //   'lifespan': loadIn.product.sku_id.lifespan,
     // }

     var item = {
       'sku': loadIn.product.sku_id,
       'cases': loadIn.returns,
       'bottlespercase': loadIn.product.sku_id.bottlespercase,
       'bay' : loadIn.bay,
       'prod_date': $filter('date')(loadIn.prodDate,'yyyy-MM-dd'),
       'lifespan': loadIn.product.sku_id.lifespan
     };

     if( _.findIndex($scope.loadIns,{ 'sku': item.sku, 
    'bay': item.bay, 'prod_date': item.prod_date}) === -1 ){
       $scope.loadIns.push(item);
       console.log($scope.loadIns);
    }else{
      var index =  _.findIndex($scope.loadIns,{ 'sku': item.sku, 
    'bay': item.bay, 'prod_date': item.prod_date});
      console.log(index);
      $scope.loadIns[index].cases += item.cases;
    }

    $scope.loadIn.product = $scope.deliveries[0].products[0];
    $scope.loadIn.bay = $scope.bays[0];
    $scope.loadIn.returns = null;
     
    

   };

   $scope.deleteLoadIn = function(index){
     console.log(index);
     $scope.loadIns.splice(index,1);
   };

   $scope.confirm = function () {

    for (var i = 0; i < $scope.loadIns.length; i++) {
      var itemInfo = {
       'sku_id': $scope.loadIns[i].sku.id,
       'cases': $scope.loadIns[i].cases,
       'bottlespercase': $scope.loadIns[i].bottlespercase,
       'bay_id': $scope.loadIns[i].bay.id,
       'prod_date': $scope.loadIns[i].prod_date,
       'lifespan': $scope.loadIns[i].lifespan,
      };
      $scope.products.push(itemInfo);
    }

    console.log($scope.products);

    var finalLoadIn = {
      'products' : $scope.products,
      'loadout': loadOutID,
      'loadin_no': loadOutID,
      'customer_id': customerID,
      'delivery': deliveryID
     }
     console.log(finalLoadIn);

     io.socket.request($scope.socketOptions('post','/load-in/add',{"Authorization": "Bearer " + authService.getToken()},finalLoadIn), function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        // $scope.bays.push(body);
          $state.go('loadIn');
          // $scope.loadIn = {};
          // $scope.products = [];
          // $scope.loadIns = [];
          // $scope.loadIn.product = $scope.loadOuts[0];
          // $scope.loadIn.bay = $scope.bays[0].id;
        $scope.$digest();
      }
    }); 

   };
  

  
}]);
