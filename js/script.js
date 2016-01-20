var appPoll = angular.module('appPoll', []);

/* Controller */

var pollController = function pollController($scope){

    /* Model Initialization */
    $scope.newQuestion = "";
    $scope.newQuestionPlaceholder = "Who will win the NBA championship this year?";
    $scope.newChoices = [];
    
    $scope.newChoices.push({placeholder: "Cleveland Cavaliers", question: ""});
    $scope.newChoices.push({placeholder: "San Antonio Spurs", question: ""});
    
    $scope.addChoice = function () {
          $scope.newChoices.push({placeholder: "Please enter the new choice", question: ""});
    };
    
    $scope.deleteChoice = function ( choiceID ) {
        
        $scope.newChoices.splice(choiceID, 1);

  
    };

};



appPoll.controller('PollController',pollController);