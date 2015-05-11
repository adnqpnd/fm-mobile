'use strict';

angular.module('fMMobileApp')
.controller('LoadInViewCtrl',['$scope','$http','$state','authService','httpHost','_',
  '$stateParams','$timeout','$filter','$cordovaDatePicker',function($scope,$http,$state,authService,httpHost,_,$stateParams,$timeout,$filter,$cordovaDatePicker){
  $scope.loadOuts = {};
  var loadInID = $stateParams.loadInID;
  $scope.bays = [];
  $scope.loadIn = {};
  $scope.loadIns = [];
  
  
  var getLoadOuts = function () {
    $http.get(httpHost + "/load-out/products?id="+loadInID+"'").success( function (data) {
      $scope.loadOuts = data;
        console.log("Load Out:");
        console.log($scope.loadOuts);

        $scope.loadIn.product = $scope.loadOuts[0];

    }).error(function (err) {
      console.log(err);
    });
  };

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

  getLoadOuts();
  // getBays();
       getBays();


   $scope.bayName = function (bay) {
     return "Bay " + bay.bay_name;
   };

   $scope.prodName = function (sku) {
     return sku.brand_name +" "+ sku.sku_name +" "+sku.size;
   };

   $scope.addLoadIn = function (loadIn){
     //$scope.loadIns.push(loadIn);
     console.log(loadIn);
     if($scope.loadIns.push(loadIn)){
     // var index = _.findIndex($scope.loadOuts,loadIn.product);
     // $scope.loadOuts.splice(index,1);
     // $scope.loadIn.product = $scope.loadOuts[0];
     }
   };

   $scope.deleteLoadIn = function(loadIn){
     var index = _.findIndex($scope.loadIns,loadIn);
     console.log(index);
     $scope.loadIns.splice(index,1);
     console.log(loadIn);
     $scope.loadOuts.push(loadIn.product);
     $scope.loadIn.product = $scope.loadOuts[0];
   };

   $scope.confirm = function () {
     var item = {
       'sku_id': loadIn.product.sku_id.id,
       'cases': loadIn.returns,
       'bottlespercase': loadIn.product.sku_id.bottlespercase,
       'bay_id': loadIn.bay,
       'prod_date': $filter('date')(loadIn.prodDate,'yyyy-MM-dd'),
       'lifespan': loadIn.product.sku_id.lifespan,
     }

    var finalLoadIn = {
      'products' :  $scope.loadIns,
      'loadout': parseInt(loadInID),
      'loadin_no': parseInt(loadInID)
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
