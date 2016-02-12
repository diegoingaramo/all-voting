/* Service */

var pollSearchService = function($http) {

    var search = function(searchText) {
      return $http.post('polls/search', {
        searchtext: searchText
      });
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
      
    
    //Model Initialization
    $scope.searchText = "";
    $scope.searchResults = [];
    
    $scope.search = function(){
        
        pollSearchService.search($scope.searchText).then(function(result) {
            
        if (result.data.success){
            $scope.searchResults = result.data.polls;
            //console.log(result);
        }
        else
            alert(result.data.message);
            
        }, function(reason) {
            alert("Error: " + reason);
        });
        
    };
  
};

angular.module('poll.search', ['ngNewRouter']).factory('pollSearchService', ['$http', pollSearchService])
  .controller('PollSearchController', ['$scope', '$routeParams','pollSearchService', pollSearchController]);