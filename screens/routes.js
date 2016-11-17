snApp.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "screens/home.html"
  })
  .when('/settings', {
      templateUrl : "screens/settings.html"
  })
});