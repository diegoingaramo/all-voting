/* Authentication services */

var authInterceptor = function(API, auth) {
  return {
    // automatically attach Authorization header
    request: function(config) {
      var token = auth.getToken();
      if(token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },

    // If a token was sent back, save it
    response: function(res) {
      if(res.data.token) {
        auth.saveToken(res.data.token);
      }
      return res;
    },
      
  }
};


var authService = function($window) {
    
  var self = this;

  self.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  };
    
  self.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
  };
    
  self.getToken = function() {
    return $window.localStorage['jwtToken'];
  };
    
  self.isAuthed = function(){
    var token = self.getToken();
    if(token) {
        var params = self.parseJwt(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
        return false;
    }
  };
    
  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  };
    
};

var userService = function($http, API, auth) {
  var self = this;
    
  self.register = function(email, password) {
  return $http.post('user/auth/register', {
      email: email,
      password: password
    })
  };
    
  self.login = function(email, password) {
      return $http.post('user/auth/login', {
          email: email,
          password: password
        })
  };

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
    
  $scope.login = function(email, password) {
    user.login(email, password);
  };
  
  $scope.register = function(email, password) {
    user.register(email, password);
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