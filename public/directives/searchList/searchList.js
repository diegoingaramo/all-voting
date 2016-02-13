app.directive('searchlist', function() {
    
    var controller = ['$scope','user', 'poll','pollSearchService', function ($scope, user, poll, pollSearchService) {
        
    /* Model Initialization */
    $scope.selectedPoll = {};
    $scope.selectedPoll.question = "";
    $scope.selectedPoll.options = [];
    $scope.newVote = {};
    $scope.viewTable = true;
        
        
    $scope.viewVotePoll = function(poll){
        
        $scope.selectedPoll.question = poll.question;
        
        alert(poll._id);
        alert($scope.getUser().username);
        
        pollSearchService.getPollByID(poll._id,$scope.getUser().username).then(function(result) {
            
        if (result.data.success){
            
            $scope.selectedPoll.options = result.data.options;
            $scope.newVote.optionText = "";
            $scope.newVote.option = 0;
            $("#votepoll-container").modal();
            
        }
        else
            alert(result.data.message);
            
        }, function(reason) {
            alert("Error: " + reason);
        });
        
    };
        
    $scope.viewPollResult = function(selectedPoll){
        
        $scope.selectedPoll.question = selectedPoll.question;
        
        pollSearchService.getPollByID(selectedPoll._id,$scope.$parent.getUser().username).then(function(result) {
            
        if (result.data.success){
            
            $scope.selectedPoll.options = result.data.poll.options;
            $scope.viewTable = true;
            $("#pollres-container").modal();
            
        }
        else
            alert(result.data.message);
            
        }, function(reason) {
            alert("Error: " + reason);
        });
        
    };
        
    $scope.viewPollChart = function(){
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'option');
        data.addColumn('number', '#votes');
        var dataRows = [];
        
        $scope.selectedPoll.options.forEach(function(element, index, array){
            dataRows.push([element.description,element.votes]);
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
        
    };
        
    $scope.viewPollTable = function(){
        $scope.viewTable = true;
    };
        
    $scope.votePoll = function(){
        //alert($scope.newVote.option); DEFAULT 0 - NO VOTE
    };


        
    }];
        
    return {
        restrict : 'E',
        templateUrl: 'directives/searchList/searchList.html',
        controller: controller,
        scope: {
            polls: '='
        }
    }
    
});