angular.module('projectxApp')
  .controller('SignupCtrl', function ($scope, Auth, $state) {
    $scope.user = {
    };

    $scope.signup = function signup() {
      Auth.signup($scope.user).then(
        function () {
          $state.go('inside');
        },function (errors) {
          $scope.errors = errors;
        });
    };
  });
