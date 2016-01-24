/* Service */

var pollSearchService = function($http) {

    var search = function(searchText) {
      return [{id: 1, question: 'Do you like coke ?'}, {id: 2, question: 'Do you like pepsi ?'},
             {id: 3, question: "What's your favorite movie ?"}];
    };
    
    var getOptionsByPoll = function(pollID) {
      return [{id: 2, text: 'Yes', votes: 124}, {id: 5, text: 'No', votes: 87},
             {id: 9, text: "I don't know", votes: 23}];
    };
    
   
    return {
      search: search,
      getOptionsByPoll: getOptionsByPoll  
    };
    
 };

/* Controller */

var pollSearchController = function ($scope, $routeParams, pollSearchService) {
      
    $scope.searchText = "";
    $scope.searchResults = [];
    $scope.selectedPoll = {};
    $scope.selectedPoll.question = "";
    $scope.selectedPoll.options = [];
    
    $scope.search = function(){
        $scope.searchResults = pollSearchService.search($scope.searchText);
    };
    
    $scope.viewPollResult = function(searchResult){
        $scope.selectedPoll.question = searchResult.question;
        $scope.selectedPoll.options = pollSearchService.getOptionsByPoll(searchResult.id);
        $("#pollres-container").modal();
    };
      
};

angular.module('poll.search', ['ngNewRouter']).factory('pollSearchService', ['$http', pollSearchService])
  .controller('PollSearchController', ['$scope', '$routeParams','pollSearchService', pollSearchController]);