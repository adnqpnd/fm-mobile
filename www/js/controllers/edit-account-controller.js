'use strict';

angular.module('FMApp.controllers')
.controller('EditAccountCtrl',['$scope','$http','$state','authService','userService','httpHost',function($scope,$http,$state,authService,
  userService,httpHost){
  $scope.editForm = 0;
  $scope.user = {};
  $scope.userEdit = {};
  $scope.password = {};
  $scope.errorMessage = false; 
 
  var getUser = function () {
    $http.get(httpHost + '/users/' + userService.getUserID()).success(function(data){
      $scope.user = data;
      $scope.userEdit = angular.copy($scope.user);
        console.log("User:");
        console.log($scope.user);
    }).error(function (err) {
      console.log(err);
    });
  };

  getUser();
  
  $scope.showErrorMessage = function(data){
    $scope.errorMessage = data;
  }

  $scope.showEditForm = function (data) {
  $scope.editForm = data;
    if (data === 0) {
      $scope.userEdit = angular.copy($scope.user);
      if ($scope.password !== null) {
        $scope.password = {};
      }
    }
  };

    $scope.editUsername = function (user) {
    console.log(user);
    io.socket.request($scope.socketOptions('put','/users/' + user.id,{"Authorization": "Bearer " + authService.getToken()} , user), function (body, JWR) {
      console.log('Sails responded with edit username: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        userService.setUsername(body.username);
        $scope.showEditForm(0);
        $scope.$digest();
      }
    }); 
  };

  $scope.editFirstname = function (user) {
    console.log(user);
    io.socket.request($scope.socketOptions('put','/users/' + user.id,{"Authorization": "Bearer " + authService.getToken()} , user), function (body, JWR) {
      console.log('Sails responded with edit firstname: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        console.log(body);
        userService.setFirstName(body.firstname);
        $scope.showEditForm(0);
        $scope.$digest();
      }
    }); 
  };

  $scope.editLastname = function (user) {
    console.log(user);
    io.socket.request($scope.socketOptions('put','/users/' + user.id,{"Authorization": "Bearer " + authService.getToken()} , user), function (body, JWR) {
      console.log('Sails responded with edit lastname: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        userService.setLastName(body.lastname);
        $scope.showEditForm(0);
        $scope.$digest();
      }
    }); 
  };

  $scope.changePassword = function (password) {
    if($scope.errorMessage === "true"){
      $scope.showErrorMessage(false);
    }
    var passwordInfo = {
      "old_password" : password.old_password,
      "new_password" : password.new_password,
      "user_id" : $scope.user.id
    };
    console.log(passwordInfo);
    io.socket.request($scope.socketOptions('post','/users/changepassword/' + passwordInfo.user_id,{"Authorization": "Bearer " + 
      authService.getToken()} , passwordInfo), function (body, JWR) {
      console.log('Sails responded with edit user: ', body);
      console.log('and with status code: ', JWR.statusCode);
      if(JWR.statusCode === 200){
        $scope.showEditForm(0);
        $scope.$digest();
      }else if (JWR.statusCode === 304) {
        $scope.showErrorMessage(true);
        $scope.password.old_password = '';
        $scope.$digest();
      }
    }); 
  };

  io.socket.on('users', function(msg){
    console.log("Message Verb: " + msg.verb);
    console.log("Message Data :");
    console.log(msg.data);
    
    if(msg.verb === "updated") {
      console.log("User Updated");
      $scope.user = msg.data;
      $scope.$digest();
    }

  });

}]);
