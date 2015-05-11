'use strict';

angular.module('fMMobileApp')
.controller('TallyViewCtrl',['$scope','$http','$state','authService','httpHost','_',
  '$stateParams','$timeout','$filter','$cordovaDatePicker',function($scope,$http,$state,authService,httpHost,_,$stateParams,$timeout,$filter,$cordovaDatePicker){
  $scope.currentLoadOut = {};
  $scope.loadOuts = {};
  var loadInID = $stateParams.loadInID;
  $scope.bays = [];
  $scope.bayArray = [];
  $scope.returns = [];
  $scope.productionDate = [];
  
  var getLoadOuts = function () {
    $http.get(httpHost + "/load-out/products?id="+loadInID+"'").success( function (data) {
      $scope.loadOuts = data;
        console.log("Load Out:");
        console.log($scope.loadOuts);
        console.log(loadInID);

       $scope.currentLoadOut = $scope.loadOuts;
     

        console.log($scope.currentLoadOut);

    }).error(function (err) {
      console.log(err);
    });
  };

  var getBays = function () {
    $http.get(httpHost + '/bays/list').success( function (data) {
      if(data.length !== 0){
      $scope.bays = data;
      console.log("Bays:");
      console.log($scope.bays);
        for (var i = $scope.currentLoadOut; i >= $scope.currentLoadOut.length; i++) {
          $scope.bayArray[i] = $scope.bays[0].id;
        }
      }
    }).error(function (err) {
      console.log(err);
    });

  };

  getLoadOuts();
  // getBays();
   $timeout(function(){
       getBays();
   }, 3000)

   $scope.bayName = function (bay) {
     return "Bay " + bay.bay_name;
   };

   $scope.confirm = function () {
     console.log($scope.bayArray);
     console.log($scope.returns);
     console.log($scope.productionDate)
     var products = [];
     for (var i = 0; i < $scope.bayArray.length; i++) {
       var item = {
         'sku_id': $scope.currentLoadOut[i].sku_id.id,
         'cases': $scope.returns[i],
         'bottlespercase': $scope.currentLoadOut[i].sku_id.bottlespercase,
         'bay_id':$scope.bayArray[i],
         'prod_date': $filter('date')($scope.productionDate[i],'yyyy-MM-dd'),
         'lifespan': $scope.currentLoadOut[i].sku_id.lifespan,
       };
       products[i] = item ;
     };
     console.log(products);
     var finalLoadIn = {
      'products' : products,
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
          $scope.bayArray = [];
          $scope.returns = [];
          $scope.productionDate = [];
        $scope.$digest();
      }
    }); 

   };
  

  
}]);
