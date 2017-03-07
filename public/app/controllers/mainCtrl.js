angular.module('mainCtrl', [])
  .controller('MainController', function ($scope, Search) {
    
    $scope.query = "";
    
    Search.all()
      .success(function (data) {
        $scope.allRestaurants = data;
      });
    
    $scope.searchByName = function () {
      var params = {
        qs : $scope.query
      }
      Search.searchByName(params)
        .success(function (data) {
          $scope.results = data
        })
    }
  });