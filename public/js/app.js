/* Authentication services */

var authInterceptor = function(API, auth) {
  return {
    // automatically attach Authorization header
    request: function(config) {
      return config;
    },

    // If a token was sent back, save it
    response: function(res) {
      return res;
    },
  }
};


var authService = function($window) {
  var self = this;

  // Add JWT methods here
    
  self.isAuthed = function(){
    return false;  
  };
    
};

var userService = function($http, API, auth) {
  var self = this;
    
  self.getQuote = function() {
    return $http.get(API + '/auth/quote')
  }

  // add authentication methods here

};


/* End authentication services */

/* Main controller definition */

AppController.$routeConfig = [
  { path: '/user/login', component: 'user_login', as:'login' },
  { path: '/user/signup', component: 'user_signup', as:'signup' }, 
  { path: '/poll/new', component: 'poll_new', as:'pollnew' }, 
  { path: '/', component: 'poll_search'}
];

function AppController($scope, $router, user, auth) {
    
  $scope.login = function() {
    user.login(self.username, self.password)
      .then(handleRequest, handleRequest)
  };
  
  $scope.register = function() {
    user.register(self.username, self.password)
      .then(handleRequest, handleRequest)
  };
  
  $scope.getQuote = function() {
    user.getQuote()
      .then(handleRequest, handleRequest)
  };
  
  $scope.logout = function() {
    auth.logout && auth.logout()
  };
    
  $scope.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
    
    
  function handleRequest(res) {
    var token = res.data ? res.data.token : null;
    if(token) { console.log('JWT:', token); }
    self.message = res.data.message;
  }
    
};

/* End main controller definition */

var app = angular.module('appPoll', ['ngNewRouter', 'poll.search','poll.new','user.login','user.signup']).controller('AppController', ['$scope', '$router', 'user', 'auth', AppController]);

app.factory('authInterceptor', authInterceptor)
.service('user', userService)
.service('auth', authService)
.constant('API', 'http://test-routes.herokuapp.com')
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});