angular.module('FMApp.services', [])

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
}])
  
.factory('authService',['$http', '$window','httpHost','$log', function ($http, $window, httpHost,$log) {

    return {
      setToken: function (token) {
        $window.localStorage.setItem('auth_token',token);
      },
      getToken: function () {
        return $window.localStorage.getItem('auth_token');
      },
      login: function (uri, params) {
        console.log("Login");
        console.log(uri);
        console.log(params);
        return $http.post(httpHost + uri, params);
      },
      logout: function () {
        $window.localStorage.removeItem('auth_token');
        // $window.localStorage.removeItem('ui');
        // userService.removeAccessLevel();
      }

    }
}])

.factory('authInterceptor',['$rootScope', '$q', '$injector', function ($rootScope, $q, $injector) {
  return {
    request: function (config) {
      var authService = $injector.get('authService');
      config.headers = config.headers || {};
      if (authService.getToken()) {
        config.headers.Authorization = 'Bearer ' + authService.getToken();
      }
      return config;
    },
    response: function (response) {
     
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
}])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
  
  