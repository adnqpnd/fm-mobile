'use strict';

angular.module('fMMobileApp')

.service('userService',['authService', '$log', 'jwtHelper','$http','$rootScope','httpHost', function (authService, $log, jwtHelper,$http,$rootScope, httpHost) {
	var userAccess = 0;
  var token = '';
  var user = {};
  var userID = null;

  console.log("User Service");

	return {

	  getUser : function () {
      console.log("get user");
	  	token = authService.getToken();
      userID = jwtHelper.decodeToken(token);
      console.log(token);
      console.log(userID);

      return $http.get(httpHost + '/users/' + userID).success(function (data) {
         user = data;
         console.log(user);
         return data;
      });
	  },

     getUserID : function () {
      console.log("Get ID");
      console.log(userID);
       return userID;
     },

     getUserType : function () {
       return user.type;
     },

     getFirstName : function () {
       return user.firstname;
     },

     getLastName : function () {
       return user.lastname;
     },

     getUserName : function () {
       return user.firstname + " " + user.lastname;
     },

     setUserName : function (username) {
       user.username = username;
     },
     
     setFirstName: function (firstname) {
       console.log("Edit firstname");
       user.firstname = firstname;
       $rootScope.$broadcast("firstName");
     },

     setLastName: function (lastname) {
      console.log("Edit lastname");
       user.lastname = lastname;
       $rootScope.$broadcast("lastName");
     }

	}
}]);
  