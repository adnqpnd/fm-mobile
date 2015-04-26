'use strict';

angular.module('fMMobileApp')
.controller('LoadInCtrl',['$scope','$http','$state','authService','httpHost','_',function($scope,$http,$state,authService,httpHost,_){
  $scope.loadOuts = [];
  $scope.trucks = [];

  var getLoadOuts = function () {
    $http.get(httpHost + '/load_out/list').success( function (data) {
      $scope.loadOuts = data;
      console.log("Load Out:");
      console.log($scope.loadOuts);
    }).error(function (err) {
      console.log(err);
    });
  };

  $scope.socketOptions = function (method,url,headers,params) {
    return {
      method: method,
      url: url,
      headers: headers,
      params: params
    };
  };

  var getTrucks = function () {
    $http.get(httpHost + '/trucks').success( function (data) {
        $scope.trucks = data;
        console.log("Trucks:");
        console.log($scope.trucks);
    }).error(function (err) {
      console.log(err);
    });
  }

  getLoadOuts();
  getTrucks();

  $scope.truckName = function (truck) {

    var index = _.findIndex($scope.trucks, { 'id': truck });
    index += 1;
    return "Truck #" + index;
  };

  $scope.confirmLoadout =  function(loadOut) {
  	var loadOutInfo = {
      "loadout_id": loadOut.id,
      "truck_id": loadOut.truck_id,
      "delivery_date": loadOut.date_created
  	};

  	console.log(loadOutInfo);

    io.socket.request($scope.socketOptions('post','/load-out/confirm',{"Authorization": "Bearer " + authService.getToken()},loadOutInfo), function (body, JWR) {
      console.log('Sails responded with post bay: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        // $scope.bays.push(body);
        //   $state.go(loadIn);
        //   $scope.bayArray = [];
        //   $scope.returns = [];
        //   $scope.productionDate = [];
        // $scope.$digest();
      }
    }); 
  };

  // io.socket.on('loadout', function(msg){
  //   console.log("Message Verb: " + msg.verb);
  //   console.log("Message Data :");
  //   console.log(msg.data);
    
  //   switch (msg.verb) {
  //     case "confirmed": 
  //       console.log("Bay Created");
        
  //       break;
  //       $scope.$digest();
  //   }
  //  }

}]);
