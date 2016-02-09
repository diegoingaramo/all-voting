/* Authentication services */

var authInterceptor = function(auth) {
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

var userService = function($http, auth) {
    
  var self = this;
    
  self.user = {};
    
  self.signup = function(email, password, rpassword) {
  return $http.post('users/signup', {
      email: email,
      password: password,
      rpassword: rpassword
    }).then(function(result) {
          if (result.data.success)
            self.user.username = email;
          return result;
      });
  };
    
  self.login = function(email, password) {
      return $http.post('users/login', {
          email: email,
          password: password
      }).then(function(result) {
          if (result.data.success)
            self.user.username = email;
          return result;
      });
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

function AppController($scope, $router, user, auth, $location) {
    
  $scope.user = user.user;
  
  
  $scope.logout = function() {
    auth.logout && auth.logout();
    $location.path('/');
  };
    
  $scope.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
    
};

/* End main controller definition */

var app = angular.module('appPoll', ['ngNewRouter', 'poll.search','poll.new','user.login','user.signup']).controller('AppController', ['$scope', '$router', 'user', 'auth', '$location', AppController]);

app.factory('authInterceptor', authInterceptor)
.service('user', userService)
.service('auth', authService)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});