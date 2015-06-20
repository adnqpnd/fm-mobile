// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('FMApp', ['ionic','FMApp.controllers','FMApp.services','FMApp.filters','ngCordova','angular-jwt'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('httpHost','http://192.168.43.224:1337')
.constant('_', window._)
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'MainCtrl'
  })
  
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })

  .state('app.edit-account', {
    url: "/edit-account",
    views: {
      'menuContent': {
        templateUrl: "templates/edit-account.html",
        controller: "EditAccountCtrl"
      }
    }
  })

  .state('app.load-in', {
    url: "/load-in",
    views: {
      'menuContent': {
        templateUrl: "templates/load-in.html",
        controller: "LoadInCtrl"
      }
    }
  })

  .state('app.load-in-deliveries', {
    url: "/load-in/:loadInID",
    views: {
      'menuContent': {
        templateUrl: "templates/load-in-deliveries.html",
        controller: "LoadInDeliveriesCtrl"
      }
    }
  })

  .state('app.load-in-view', {
    url: "/load-in/view/:deliveryID",
    views: {
      'menuContent': {
        templateUrl: "templates/load-in-view.html",
        controller: "LoadInViewCtrl"
      }
    }
  })

  .state('app.tally', {
    url: "/tally",
    views: {
      'menuContent': {
        templateUrl: "templates/tally.html",
        controller: "TallyCtrl"
      }
    }
  })

  .state('app.tally-view', {
    url: "/tally/:loadInID",
    views: {
      'menuContent': {
        templateUrl: "templates/tally-view.html",
        controller: "TallyViewCtrl"
      }
    }
  })

  .state('app.empties', {
      url: "/empties",
      views: {
        'menuContent': {
          templateUrl: "templates/empties.html",
          controller: 'EmptiesCtrl'
        }
      }
  })

  .state('app.empties-deliveries', {
      url: "/empties/:loadInID",
      views: {
        'menuContent': {
          templateUrl: "templates/empties-deliveries.html",
          controller: 'EmptiesDeliveriesCtrl'
        }
      }
  })

  .state('app.empties-view', {
      url: "/empties/view/:deliveryID",
      views: {
        'menuContent': {
          templateUrl: "templates/empties-view.html",
          controller: 'EmptiesViewCtrl'
        }
      }
  });

  // .state('app.single', {
  //   url: "/playlists/:playlistId",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/playlist.html",
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
