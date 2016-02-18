app.directive('searchlist', function() {
    
    var controller = ['$scope','poll','pollSearchService','user','$filter', function ($scope, poll, pollSearchService, user, $filter) {
        
    /* Model Initialization */
    $scope.selectedPoll = {};
    //$scope.selectedPoll.question = "";
    //$scope.selectedPoll.options = [];
    $scope.newVote = {};
    $scope.viewTable = true;
        
        
    $scope.viewVotePoll = function(selectedPoll){
        
        //$scope.selectedPoll.question = selectedPoll.question;
        
        pollSearchService.getPollByID(selectedPoll._id).then(function(result) {
            
        if (result.data.success){
            
            //$scope.selectedPoll.options = result.data.poll.options;
            $scope.selectedPoll = result.data.poll;
            $scope.newVote.optionText = "";
            $scope.newVote.optionIndex = -2;
            $scope.viewTable = true;
            $("#votepoll-container").modal();
            
        }
        else
             bootbox.alert(result.data.message);
            
        }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
        
    };
        
    $scope.viewPollResult = function(selectedPoll){
        
        //$scope.selectedPoll.question = selectedPoll.question;
        
        //console.log($scope.polls);
        
        pollSearchService.getPollByID(selectedPoll._id).then(function(result) {
            
        if (result.data.success){
            
            //$scope.selectedPoll.options = result.data.poll.options;
            $scope.selectedPoll = result.data.poll;
            $scope.viewTable = true;
            $("#pollres-container").modal();
            
        }
        else
             bootbox.alert(result.data.message);
            
        }, function(reason) {
             bootbox.alert("Error: " + reason);
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
        
    $scope.removePoll = function(selectedPoll){
        
        poll.remove(selectedPoll._id, user.currentUser().username).then(function (result){
            
            if (result.data.success){
            
                bootbox.alert("Your poll has been deleted !");
                $scope.polls = $filter('findobj')($scope.polls, selectedPoll);
            
            }
            else
                bootbox.alert(result.data.message);
            
        }, function(reason) {
             bootbox.alert("Error: " + reason);
        });
    };  
        
    $scope.votePoll = function(){
        
        if ($scope.newVote.optionIndex == -2){
            bootbox.alert("You must select an option");
            return;
        }
        
        if ($scope.newVote.optionIndex == -1 && $scope.newVote.optionText == ""){
            bootbox.alert("You must enter the new option's text");
            return;
        }
            
        var optionID = ($scope.newVote.optionIndex == -1)?0:$scope.selectedPoll.options[$scope.newVote.optionIndex]._id;
        
        poll.vote(optionID, $scope.newVote.optionText,$scope.selectedPoll._id).then(function (result){
            
            if (result.data.success){
            
                bootbox.alert("Your vote has been registered !");
                $("#votepoll-container").modal('hide');
            
            }
            else
                bootbox.alert(result.data.message);
            
        }, function(reason) {
            bootbox.alert("Error: " + reason);
        });
    };
        
    $scope.showPoll = function(poll){
        return $scope.$parent.isAuthed() && poll.ownerEmail == user.currentUser().username;
    }


        
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