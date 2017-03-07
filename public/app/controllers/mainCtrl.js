angular.module('mainCtrl', [])
  .controller('MainController', function ($scope, Search) {

    Search.all()
      .success(function (data) {
        $scope.allRestaurants = data;
      });
  });