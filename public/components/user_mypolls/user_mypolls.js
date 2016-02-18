var myPollController = function ($scope, $routeParams, poll) {
    
    //Model Initialization
    $scope.searchResults = [];
    
    $scope.init = function(){
        
        poll.getPollsByUser($scope.getUser().username).then(function(result) {
            
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
    
    $scope.init();
    
};

angular.module('user.mypolls', ['ngNewRouter']).controller('MyPollController', ['$scope', '$routeParams', 'poll', myPollController]);