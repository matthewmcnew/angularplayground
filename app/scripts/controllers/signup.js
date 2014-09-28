angular.module('projectxApp')
  .controller('SignupCtrl', function ($scope, Auth) {
    $scope.user = {
    };

    $scope.signup = function signup(){
      Auth.signup($scope.user).then(function(data){
      }, function(args) {
      });
    };
  });
