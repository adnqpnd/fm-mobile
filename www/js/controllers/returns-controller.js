// 'use strict';

// angular.module('fMMobileApp')
// .controller('ReturnsCtrl',['$scope','$http','$state','authService','httpHost','_',
//   '$stateParams','$timeout','$filter','$cordovaDatePicker',function($scope,$http,$state,authService,httpHost,_,$stateParams,$timeout,$filter,$cordovaDatePicker){
//   $scope.returns = {};
//   $scope.deliveryID = $stateParams.deliveryID;
  
//   var getDeliveries = function () {
//     $http.get(httpHost + "/delivery_transactions?where={'loadout_id' : "+ loadInID +"}").success( function (data) {
//       $scope.deliveries = data;
//         console.log("Load Out:");
//         console.log($scope.deliveries);
//         console.log(loadInID);
//     }).error(function (err) {
//       console.log(err);
//     });
//   };

//   getDeliveries();
  
//   $scope.submit = function (returns) {
//     console.log(returns);
//     var returnsInfo = {
//       "returns":returns.returnsValue, 
//       "deposit":returns.deposit, 
//       "delivery": parseInt($scope.deliveryID) 
//     };

//     console.log(returnsInfo);
 

//   io.socket.request($scope.socketOptions('post','/delivery/empties',{"Authorization": "Bearer " + authService.getToken()},returnsInfo), 
//   	function (body, JWR) {
//       console.log('Sails responded with post bay: ', body);
//       console.log('and with status code: ', JWR.statusCode);
//       if(JWR.statusCode === 200){
//         // $scope.bays.push(body);
//           $state.go('empties');
//           $scope.returns = {}
//         $scope.$digest();
//       }
//     }); 
//    };
  
// }]);
