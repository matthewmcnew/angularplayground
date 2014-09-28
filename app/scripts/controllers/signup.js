angular.module('projectxApp')
  .controller('SignupCtrl', function ($scope, Auth) {
    $scope.user = {
    };

    $scope.signup = function signup(){
        debugger;
      Auth.signup($scope.user).then(function(data){
        debugger;
      }, function(args) {
        debugger;

      });
    };
  });
