/* Service */

var pollSearchService = function($http) {

    var search = function(searchText) {
      return $http.post('polls/search', {
        searchtext: searchText
      });
    };
    
    var getPollByID = function(pollID) {
      return $http.post('polls/getByID', {
        pollID: pollID
      });
    };
    
    return {
      search: search,
      getPollByID: getPollByID
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
             bootbox.alert(result.data.message);
            
        }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
        
    };
  
};

angular.module('poll.search', ['ngNewRouter']).factory('pollSearchService', ['$http', pollSearchService])
  .controller('PollSearchController', ['$scope', '$routeParams','pollSearchService', pollSearchController]);