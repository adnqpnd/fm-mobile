'use strict';

angular.module('FMApp.controllers')
.controller('EmptiesCtrl',['$scope','$http','$state','authService','httpHost','_',function($scope,$http,$state,authService,httpHost,_){
  $scope.loadOuts = [];
  $scope.trucks = [];
  $scope.today = new Date();
  $scope.today.setDate($scope.today.getDate() + 1);
  $scope.formatToday =  $scope.formatDate($scope.today);
  console.log($scope.formatToday);

  var getLoadOuts = function () {
    $http.get(httpHost + '/load-out/complete-loadouts?date=' + $scope.formatToday).success( function (data) {
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
    console.log(truck);
    var index = _.findIndex($scope.trucks, { 'id': truck });
    console.log(index);
    index += 1;
    return "Truck #" + index;
  };


}]);
