'use strict';

angular.module('FMApp.controllers')
.controller('EmptiesCtrl',['$scope','$http','$state','authService','httpHost','_','userService','$timeout',
  function($scope,$http,$state,authService,httpHost,_,userService,$timeout){
  $scope.loadOuts = [];
  $scope.trucks = [];
  $scope.today = new Date();
  $scope.formatToday =  $scope.formatDate($scope.today);
  console.log($scope.formatToday);

  var getLoadOuts = function () {
    $http.get(httpHost + '/load-out/complete-loadouts?date=' + $scope.formatToday + '&truck=' + $scope.trucks.id).success( function (data) {
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
    $http.get(httpHost + '/trucks/employee-truck?user='+ userService.getUserID()).success( function (data) {
        $scope.trucks = data;
        console.log("Trucks:");
        console.log($scope.trucks);
    }).error(function (err) {
      console.log(err);
    });
  };

   getTrucks();
  $timeout(getLoadOuts,3000);

  $scope.truckName = function (truck) {
    console.log(truck);
    var index = _.findIndex($scope.trucks, { 'id': truck });
    console.log(index);
    index += 1;
    return "Truck #" + index;
  };


}]);
