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
    $scope.viewTable = true;
    $scope.selectedPoll = {};
    $scope.selectedPoll.question = "";
    $scope.selectedPoll.options = [];
    
    $scope.search = function(){
        $scope.searchResults = pollSearchService.search($scope.searchText);
    };
    
    $scope.viewPollResult = function(searchResult){
        $scope.selectedPoll.question = searchResult.question;
        $scope.selectedPoll.options = pollSearchService.getOptionsByPoll(searchResult.id);
        $scope.viewTable = true;
        $("#pollres-container").modal();
    };
    
    $scope.viewPollChart = function(){
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'option');
        data.addColumn('number', '#votes');
        var dataRows = [];
        
        $scope.selectedPoll.options.forEach(function(element, index, array){
            dataRows.push([element.text,element.votes]);
        });
        
        data.addRows(dataRows);

        // Set chart options
        var options = {is3D: false,
                       width: 800, 
                       height: 300,
                       titlePosition: 'none',
                       'chartArea': {'width': '100%', 'height': '70%'}
                      };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        
        $scope.viewTable = false;
        
    }
    
    $scope.viewPollTable = function(){
        $scope.viewTable = true;
    };
    
      
};

angular.module('poll.search', ['ngNewRouter']).factory('pollSearchService', ['$http', pollSearchService])
  .controller('PollSearchController', ['$scope', '$routeParams','pollSearchService', pollSearchController]);