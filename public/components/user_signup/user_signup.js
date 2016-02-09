angular.module('user.signup', ['ngNewRouter'])
  .controller('UserSignupController', ['$scope','user','$location','$routeParams', function ($scope,user,$location, $routeParams){
    
    //model initialization
    $scope.email = "";
    $scope.password = "";
    $scope.rpassword = "";
      
      
    $scope.signup = function() {
        user.signup($scope.email, $scope.password, $scope.rpassword).then(function(result) {
            if (result.data.success)
                $location.path('/');
            else
                alert(result.data.message);
       }, function(reason) {
        alert("Error: " + reason);
       });
    };
      
  }]);