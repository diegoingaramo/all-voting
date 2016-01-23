/* Service */

var pollSearchService = function($http) {

    var search = function() {
      return [{id: 1, question: 'Do you like coke ?'}, {id: 2, question: 'Do you like pepsi ?'},
             {id: 3, question: "What's your favorite movie ?"}];
    };
    
   
    return {
      search: search
    };
    
 };

/* Controller */

var pollSearchController = function ($scope, $routeParams, pollSearchService) {
      
    $scope.searchText = "";
    $scope.searchResults = [];
    
    $scope.search = function(){
        $scope.searchResults = pollSearchService.search($scope.searchText);
    };
      
};

angular.module('poll.search', ['ngNewRouter']).factory('pollSearchService', ['$http', pollSearchService])
  .controller('PollSearchController', ['$scope', '$routeParams','pollSearchService', pollSearchController]);