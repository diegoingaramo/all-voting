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
        return true;
        //var params = self.parseJwt(token);
        //return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
        return false;
    }
  };
    
  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
    $window.localStorage.removeItem('user');
  };
    
};

var userService = function($http, auth, $window) {
    
  var self = this;
    
  self.signup = function(email, password, rpassword) {
  return $http.post('users/signup', {
      email: email,
      password: password,
      rpassword: rpassword
    }).then(function(result) {
          if (result.data.success){
             $window.localStorage.setItem('user',JSON.stringify({username: email}));
          }
          return result;
      });
  };
    
  self.login = function(email, password) {
      return $http.post('users/login', {
          email: email,
          password: password
      }).then(function(result) {
          if (result.data.success){
            $window.localStorage.setItem('user',JSON.stringify({username: email}));
          }
          return result;
      });
  };
    
    
  self.currentUser = function() {
    if ($window.localStorage.getItem('user'))
      return JSON.parse($window.localStorage.getItem('user'));
    else
      return {};
  };
    
};


/* End authentication services */

/* Poll Service */

var pollService = function($http) {
    
  var self = this;
    
  self.getPollsByUser = function(email) {
      return $http.post('polls/getPollsByUser', {
          email: email
      });
  };
    
  self.new = function(poll,email) {
      return $http.post('polls/new', {
          question: poll.question,
          options: poll.options,
          email: email
      });
  };
    
  self.vote = function(optionID,newOptionText,pollID) {
      return $http.post('polls/vote', {
          optionID: optionID,
          newOptionText: newOptionText,
          pollID: pollID
      });
  };
    
  self.remove = function(pollID,email) {
      return $http.post('polls/remove', {
          pollID: pollID,
          email: email
      });
  };    
    
};


/* End Poll Service */

/* Main controller definition */

AppController.$routeConfig = [
  { path: '/user/login', component: 'user_login', as:'login' },
  { path: '/user/signup', component: 'user_signup', as:'signup' }, 
  { path: '/poll/new', component: 'poll_new', as:'pollnew' }, 
  { path: '/', component: 'poll_search'},
  { path: '/user/mypolls', component: 'user_mypolls', as: 'mypolls'}
];

function AppController($scope, $router, user, auth, $location) {
    
  $scope.logout = function() {
    auth.logout && auth.logout();
    $location.path('/');
  };
    
  $scope.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  };
    
  $scope.getUser = function(){
      return user.currentUser();
  }
  
    
};

/* End main controller definition */

var app = angular.module('appPoll', ['ngNewRouter', 'poll.search', 'poll.new', 'user.login', 'user.signup', 'user.mypolls']).controller('AppController', ['$scope', '$router', 'user', 'auth', '$location', AppController]);

app.factory('authInterceptor', authInterceptor)
.service('user', userService)
.service('auth', authService)
.service('poll', pollService)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}).filter('findobj', function() {

  return function(list, obj) {

    return list.filter(function(l) {
      if (obj._id == l._id) 
        return false;
      else
        return true;
    });
  };
    
});