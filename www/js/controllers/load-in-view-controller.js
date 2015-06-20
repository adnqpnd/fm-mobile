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
  $scope.totalAmount = 0;
  $scope.returnMax = 0;
  
  $scope.errorMessage ='';
  $scope.hasError = false;
  
  $scope.showErrorMessage = function (data,message) {
    $scope.hasError = data;
    if(data === true){
      $scope.errorMessage = message;
    }
  };

  var getLoadOuts = function () {
    $http.get(httpHost + "/delivery/list?id="+ deliveryID).success( function (data) {
      $scope.deliveries = data;
      console.log($scope.deliveries);
      $scope.loadIn.product = $scope.deliveries[0].products[0];
      $scope.getBays($scope.loadIn.product);
      customerID = $scope.deliveries[0].customer_id.id;
      $scope.getProdDate($scope.loadIn.product);
      $scope.getMax($scope.loadIn.product);
    }).error(function (err) {
      console.log(err);
    });
  };

  $scope.getMax = function(sku){
    console.log("SKUUUU");
    console.log(sku.cases);
    $scope.returnMax = sku.cases;
  };

  $scope.getProdDate = function (prod) {
    console.log(prod);
    if(prod.prod_date != null){
      console.log("Have ProdDate");
      $scope.loadIn.prodDate = new Date($scope.loadIn.product.prod_date); 
    }else{
       console.log("Dont Have ProdDate");
      $scope.loadIn.prodDate = new Date();
    }
  }

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
    console.log("Get Bays");
     $http.get(httpHost + '/bays/list/sku-lines?id=' + sku.sku_id.id).success( function (data) {
      console.log(data);
      if(data.length !== 0){
      $scope.bays = $scope.sortData(data,'bay_name');
      $scope.loadIn.bay = $scope.bays[0];        
      console.log("Bays:");
      console.log($scope.bays);
        $scope.noBays =false;
      }else{
        console.log("No Bays");
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
     return sku.prod_id.brand_name +" "+ sku.sku_name +" "+sku.size;
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
       'prod_date': $scope.formatDate(loadIn.prodDate),
       'lifespan': loadIn.product.sku_id.lifespan,
       'amount': loadIn.returns * loadIn.product.sku_id.pricepercase
     };

     console.log(loadIn.returns);
     console.log(loadIn.product.sku_id.pricepercase);

     if( _.findIndex($scope.loadIns,{ 'sku': item.sku, 
    'bay': item.bay, 'prod_date': item.prod_date}) === -1 ){
       $scope.loadIns.push(item);
       $scope.totalAmount += item.amount;
       console.log($scope.loadIns);
    }else{
      var index =  _.findIndex($scope.loadIns,{ 'sku': item.sku, 
    'bay': item.bay, 'prod_date': item.prod_date});
      console.log(index);
      $scope.loadIns[index].cases += item.cases;
      $scope.totalAmount += item.amount;
    }

    $scope.loadIn.product = $scope.deliveries[0].products[0];
    $scope.loadIn.bay = $scope.bays[0];
    $scope.loadIn.returns = null;
     
    

   };

   $scope.deleteLoadIn = function(index,loadIn){
     console.log(index);
     $scope.loadIns.splice(index,1);
     $scope.totalAmount -= loadIn.amount;

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
      'delivery': deliveryID,
      'total_amount': $scope.totalAmount
     }
     console.log(finalLoadIn);

     io.socket.request($scope.socketOptions('post','/load-in/add',{"Authorization": "Bearer " + authService.getToken()},finalLoadIn), function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        // $scope.bays.push(body);
          $state.go('app.load-in');
          // $scope.loadIn = {};
          // $scope.products = [];
          // $scope.loadIns = [];
          // $scope.loadIn.product = $scope.loadOuts[0];
          // $scope.loadIn.bay = $scope.bays[0].id;
        $scope.showErrorMessage(true,body.message);
        $scope.$digest();
      }
    }); 

   };



    io.socket.on('bays', function(msg){
    console.log("Message Verb: " + msg.verb);
    console.log("Message Data :");
    console.log(msg.data);
    
    switch (msg.verb) {
      case "created": 
          console.log($scope.loadIn.product.sku_id.id);
          console.log(msg.data.sku_id.id);
          if($scope.loadIn.product.sku_id.id === msg.data.sku_id.id){
            console.log("SKU");
            $scope.bays.push(msg.data);
            $scope.bays = $scope.sortData($scope.bays,'bay_name');
            $scope.loadIn.bay = $scope.bays[0];
            if($scope.noBays === true){
              $scope.noBays = false;
            }
          }
        $scope.$digest();
        break;
      case "updated":
        console.log("Bay Updated");
        console.log($scope.loadIn.product.sku_id.id);
        console.log(msg.data.sku_id.id);
        if($scope.loadIn.product.sku_id.id === msg.data.sku_id.id){
            console.log("sku match");
            var index = _.findIndex($scope.bays,{'id': msg.data.id});
            console.log(index);
            $scope.bays[index] = msg.data;
            $scope.bays = $scope.sortData($scope.bays,'bay_name');
            $scope.loadIn.bay = $scope.bays[0];
        }
        $scope.$digest();
        break;
      case "destroyed":
        console.log("Bay Deleted");
        console.log($scope.loadIn.product.sku_id.id);
        console.log(msg.data[0].sku_id.id);
        if($scope.loadIn.product.sku_id.id === msg.data[0].sku_id){
            console.log("sku match");
            var index = _.findIndex($scope.bays,{'id': msg.data[0].bay_id});
            $scope.bays.splice(index,1);
            if($scope.bays.length === 0){
              $scope.noBays = true;
            }else{
              $scope.bays = $scope.sortData($scope.bays,'bay_name');
              $scope.loadIn.bay = $scope.bays[0];
            }

        }
        $scope.$digest();

    }

  });
  

  
}]);
