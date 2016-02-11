app.directive('intropanel', function() {
    var controller = ['$scope','user', 'poll', function ($scope, user, poll) {
        
    $scope.getUserPolls = function(){
        
        poll.getPollsByUser($scope.getUser().username).then(function(result) {
            
        if (result.data.success){
            //$scope.user = user.currentUser();
            //$location.path('/');
            console.log(result);
        }
        else
            alert(result.data.message);
            
        }, function(reason) {
            alert("Error: " + reason);
        });
    };
        
    }];
        
    return {
        restrict : 'E',
        templateUrl: 'directives/intro/intro.html',
        controller: controller
    }
});