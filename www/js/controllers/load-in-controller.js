'use strict';

angular.module('FMApp.controllers')
.controller('LoadInCtrl',['$scope','$http','$state','authService','httpHost','_','userService','$timeout',
  function($scope,$http,$state,authService,httpHost,_,userService,$timeout){
  $scope.loadOuts = [];
  $scope.trucks = [];
  $scope.today = new Date();
  $scope.formatToday =  $scope.formatDate($scope.today);
  console.log($scope.formatToday);

  var getLoadOuts = function () {
    $http.get(httpHost + '/load-out/list-in-progress?date=' + $scope.formatToday + '&truck=' + $scope.trucks.id ).success( function (data) {
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
    console.log(userService.getUserID());
    return $http.get(httpHost + '/trucks/employee-truck?user='+ userService.getUserID()).success( function (data) {
        $scope.trucks = data;
        $scope.trucks;
        console.log("Trucks:");
        console.log($scope.trucks);
    }).error(function (err) {
      console.log(err);
    });
  }

  getTrucks().success(function(){
    getLoadOuts();
  });




  $scope.truckName = function (truck) {
    console.log(truck);
    var index = _.findIndex($scope.trucks, { 'id': truck });
    console.log(index);
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
      }
    }); 
  };

  io.socket.on('loadout', function(msg){
    console.log("Message Verb: " + msg.verb);
    console.log("Message Data :");
    console.log(msg.data);
    
    if(msg.verb === "confirmed") {
      console.log("LoadOut Confirmed");
      var index = _.findIndex($scope.loadOuts,{'id': msg.data.id});
      $scope.loadOuts[index] = msg.data;
      $scope.$digest();
    }

    switch (msg.verb) {
      case "created": 
        console.log("LoadOut Created");
        $scope.loadOuts.push(msg.data);
        $scope.$digest();
        break;
      case "updated":
        console.log("LoadOut Updated");
        var index = _.findIndex($scope.loadOuts,{'id': msg.data.id});
        console.log(index);
        $scope.loadOuts[index] = msg.data;
        $scope.$digest();
        break;
      case "destroyed":
        console.log("Employee Deleted");
        console.log(msg.data[0].emp_id);
        var index = _.findIndex($scope.employees,{'id': msg.data[0].emp_id});
        console.log(index);
        $scope.employees.splice(index,1);
        $scope.employees =  $scope.sortData($scope.employees,'emp_fname');
        $scope.user.fullname = $scope.employees[0];
        if($scope.employees.length === 0){
          $scope.noEmployees = true;
        }
        $scope.$digest();
        break;
      case "confirmed":
        console.log("LoadOut Confirmed");
        var index = _.findIndex($scope.loadOuts,{'id': msg.data.id});
        $scope.loadOuts[index] = msg.data;
        $scope.$digest();
    }

  });

}]);
