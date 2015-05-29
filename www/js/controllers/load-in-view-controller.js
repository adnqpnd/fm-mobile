'use strict';

angular.module('fMMobileApp')
.controller('LoadInViewCtrl',['$scope','$http','$state','authService','httpHost','_',
  '$stateParams','$timeout','$filter','$cordovaDatePicker',function($scope,$http,$state,authService,httpHost,_,$stateParams,$timeout,$filter,$cordovaDatePicker){
  $scope.loadOuts = {};
  var loadInID = $stateParams.loadInID;
  var deliveryID = $stateParams.deliveryID;
  var customerID = null;
  var loadOutID = null;
  $scope.deliveries = [];
  $scope.bays = [];
  $scope.loadIn = {};
  $scope.loadIns = [];
  

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
  
  var getLoadOuts = function () {
    $http.get(httpHost + "/delivery/list?id="+ deliveryID).success( function (data) {
      $scope.deliveries = data;
      $scope.loadIn.product = $scope.deliveries[0].products[0];
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

  var getLoadOutNumber = function () {
    $http.get(httpHost + "/delivery_transactions/"+ deliveryID).success( function (data) {
      loadOutID = data.loadout_id.id;
      console.log("Load Out Number");
      console.log(loadOutID);
    }).error(function (err) {
      console.log(err);
    }); 
  }

  var getBays = function () {
    $http.get(httpHost + '/bays/list').success( function (data) {
      if(data.length !== 0){
      $scope.bays = data;
       $scope.loadIn.bay = $scope.bays[0].id;
      console.log("Bays:");
      console.log($scope.bays);
      }
    }).error(function (err) {
      console.log(err);
    });

  };

  if(loadInID){
    getDeliveries();
  }else{
    getLoadOuts();
    getLoadOutNumber();
    getBays();
  }


   $scope.bayName = function (bay) {
     return "Bay " + bay.bay_name;
   };

   $scope.prodName = function (sku) {
     return sku.prod_id.brand_name +" "+ sku.sku_name;
   };

   $scope.addLoadIn = function (loadIn){
    console.log(loadIn);
     var item = {
       'sku_id': loadIn.product.sku_id.id,
       'cases': loadIn.returns,
       'bottlespercase': loadIn.product.sku_id.bottlespercase,
       'bay_id': loadIn.bay,
       'prod_date': $filter('date')(loadIn.prodDate,'yyyy-MM-dd'),
       'lifespan': loadIn.product.sku_id.lifespan,
     }

     if( _.findIndex($scope.loadIns,{ 'sku_id': item.sku_id, 
    'bay_id': item.bay_id, 'prod_date': item.prod_date}) === -1 ){
       $scope.loadIns.push(item);
       console.log($scope.loadIns);
    }else{
      var index =  _.findIndex($scope.loadIns,{ 'sku_id': item.sku_id, 
      'bay_id': item.bay_id, 'prod_date': item.prod_date});
      console.log(index);
      $scope.loadIns[index].cases += item.cases;
    }
     
    

   };

   $scope.deleteLoadIn = function(index){
     console.log(index);
     $scope.loadIns.splice(index,1);
   };

   $scope.confirm = function () {

    var finalLoadIn = {
      'products' :  $scope.loadIns,
      'loadout': loadOutID,
      'loadin_no': loadOutID,
      'customer': customerID
     }
     console.log(finalLoadIn);

     io.socket.request($scope.socketOptions('post','/load-in/add',{"Authorization": "Bearer " + authService.getToken()},finalLoadIn), function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        // $scope.bays.push(body);
          $state.go('loadIn');
          $scope.loadIn = {}
          $scope.loadIn.product = $scope.loadOuts[0];
          $scope.loadIn.bay = $scope.bays[0].id;
        $scope.$digest();
      }
    }); 

   };
  

  
}]);
