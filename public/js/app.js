var app = angular.module('appPoll', ['ngNewRouter', 'poll.search','poll.new','user.login','user.signup']).controller('AppController', ['$router', AppController]);

AppController.$routeConfig = [
  { path: '/user/login', component: 'user_login', as:'login' },
  { path: '/user/signup', component: 'user_signup', as:'signup' }, 
  { path: '/poll/new', component: 'poll_new', as:'pollnew' }, 
  { path: '/', component: 'poll_search'}
];

function AppController($router) {};