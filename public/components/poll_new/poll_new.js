/* Controller */

var pollNewController = function($scope, $routeParams, poll) {

    /* Model Initialization */
    $scope.init = function(){
        
        $scope.newQuestion = "";
        $scope.newQuestionPlaceholder = "Who will win the NBA championship this year?";
        $scope.newChoices = [];

        $scope.newChoices.push({placeholder: "Cleveland Cavaliers", description: "", votes: 0});
        $scope.newChoices.push({placeholder: "San Antonio Spurs", description: "", votes: 0});

        $scope.showMaxSizeError = false;

    };
    
    $scope.addChoice = function () {
        
        if ($scope.newChoices.length >= 2)
            $scope.showMaxSizeError = false;
        
          $scope.newChoices.push({placeholder: "Please enter the new choice", description: "", votes: 0});
    };
    
    $scope.deleteChoice = function ( choiceID ) {
        
        if ($scope.newChoices.length <= 2)
            $scope.showMaxSizeError = true;
            
        if ($scope.newChoices.length > 2)
            $scope.newChoices.splice(choiceID, 1);
        
    };
    
    $scope.hideMessage = function(){
        $scope.showMaxSizeError = false;
    };
    
    $scope.insertPoll = function(){
        var newPoll = {};
        newPoll.question = $scope.newQuestion;
        newPoll.options = $scope.newChoices;
        //console.log(newPoll);
        poll.new(newPoll,$scope.getUser().username).then(function(result) {
           if (result.data.success){
               bootbox.alert("Poll Added !");
               $scope.init();
           }
           else
                bootbox.alert(result.data.message);
           }, function(reason) {
            bootbox.alert("Error: " + reason);
        }); 
    };
    
    $scope.init();

};

angular.module('poll.new', ['ngNewRouter'])
  .controller('PollNewController', ['$scope', '$routeParams', 'poll', pollNewController]);