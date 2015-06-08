'use strict';

angular.module('FMApp.controllers')
.controller('EmptiesDeliveriesCtrl',['$scope','$http','$state','authService','httpHost',
  '$stateParams',function($scope,$http,$state,authService,httpHost,$stateParams){
  $scope.deliveries = [];
  var loadInID = $stateParams.loadInID;
  
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

  getDeliveries();
  
}]);
