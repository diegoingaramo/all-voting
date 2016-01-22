/* Controller */

var pollNewController = function($scope, $routeParams) {

    /* Model Initialization */
    $scope.newQuestion = "";
    $scope.newQuestionPlaceholder = "Who will win the NBA championship this year?";
    $scope.newChoices = [];
    
    $scope.newChoices.push({placeholder: "Cleveland Cavaliers", question: ""});
    $scope.newChoices.push({placeholder: "San Antonio Spurs", question: ""});
    
    $scope.showMaxSizeError = false;
    
    $scope.addChoice = function () {
        
        if ($scope.newChoices.length >= 2)
            $scope.showMaxSizeError = false;
        
          $scope.newChoices.push({placeholder: "Please enter the new choice", question: ""});
    };
    
    $scope.deleteChoice = function ( choiceID ) {
        
        if ($scope.newChoices.length <= 2)
            $scope.showMaxSizeError = true;
            
        if ($scope.newChoices.length > 2)
            $scope.newChoices.splice(choiceID, 1);
        
    };
    
    $scope.hideMessage = function(){
        $scope.showMaxSizeError = false;
    }

};

angular.module('poll.new', ['ngNewRouter'])
  .controller('PollNewController', ['$scope', pollNewController]);