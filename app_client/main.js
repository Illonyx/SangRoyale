(function () {

  angular.module('sangRoyaleApp', ['ngRoute', 'ui.bootstrap', 'ui.calendar']);

  function config ($routeProvider, $locationProvider, $windowProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: '/about/about.view.html',
        controller: 'aboutCtrl',
        controllerAs: 'vm'
      })
      .when('/tournaments', {
        templateUrl: '/tournaments/tournaments.view.html',
        controller: 'tournamentsCtrl',
        controllerAs: 'vm'
      })
      .when('/tournamentsplanning', {
        templateUrl: '/tournaments/tournaments-planning.view.html',
        controller: 'calendarCtrl',
        controllerAs: 'vm'
      })
      .when('/loyalty', {
        templateUrl: '/loyalty/loyalty.view.html',
        controller: 'loyaltyCtrl',
        controllerAs: 'vm'
      })
      .when('/other/guides', {
        templateUrl: '/other/other.guides.view.html'
      })
      .when('/other/media', {
        templateUrl: '/other/other.media.view.html'
      })
      .when('/other/updatelog', {
        templateUrl: '/other/other.update-app-log.view.html'
      })
      .when('/crownchest', {
        templateUrl : '/crownchest/crownchest.html', 
        controller: 'crownchestsCtrl', 
        controllerAs : 'vm'
      })
      .when('/events', {
        templateUrl : '/events/events.html', 
        controller: 'eventsCtrl', 
        controllerAs : 'vm'
      })
      .when('/events/new', {
        templateUrl : '/events/event-add.html', 
        controller: 'eventAddCtrl', 
        controllerAs : 'vm'
      })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    //Allow new window opening
    var $window = $windowProvider.$get();
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
    });
  }
  
  angular
    .module('sangRoyaleApp')
    .config(['$routeProvider', '$locationProvider', '$windowProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();