// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('fMMobileApp', ['ionic','angular-jwt'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.constant('_', window._)
.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('loadIn', {
    url: '/loadIn',
    templateUrl: 'templates/load-in.html',
    controller: 'LoadInCtrl'
  })
  .state('editAccount', {
    url: '/edit-account',
    templateUrl: 'templates/edit-account.html',
  })
  .state('viewLoadIn', {
    url: '/loadIn/:loadInID',
    templateUrl: 'templates/load-in-view.html',
  });

  $urlRouterProvider.otherwise('/');
})
.constant('httpHost','http://192.168.1.116:1337')
.controller('MainCtrl',['$scope','userService','authService','$ionicActionSheet','$state','$rootScope', function($scope,userService,authService,
  $ionicActionSheet,$state,$rootScope){
   userService.getUser().success(function(data){
    $scope.userId = data.id
    $scope.userType =  data.type;
    $scope.userFirstName = data.firstname;
    $scope.userLastName = data.lastname;
    $scope.userName = $scope.userFirstName + " " + $scope.userLastName;
    console.log($scope.userName);
   });

   $rootScope.$on("firstName",function(){
    console.log("Firstname");
     $scope.userFirstName = userService.getFirstName();
     console.log($scope.userFirstName);
     $scope.$digest();
  });
  
  $rootScope.$on("lastName",function(){
    console.log("lastname");
     $scope.userLastName = userService.getLastName();
     console.log($scope.userLastName);
     $scope.$digest();
  });

  $scope.socketOptions = function (method,url,headers,params) {
    return {
      method: method,
      url: url,
      headers: headers,
      params: params
    };
  };

  $scope.showSettings  = function () {
    console.log("Show settings");
    $ionicActionSheet.show({
     buttons: [
       { text: 'Edit Account'},
       {text: 'Log Out'}
     ],
     titleText: 'SETTINGS',
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       if(index === 0){
         $state.go('editAccount');
       }else{
         authService.logout();
         $state.go('login');
       }
     }
   });
  };

}]);

