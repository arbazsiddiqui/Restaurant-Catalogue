angular.module('mainService', [])

  .factory('Search', function ($http) {
    var searchFactory = {};

    searchFactory.all = function () {
      return $http.get('/restaurant/allRestaurant');
    };

    return searchFactory;
  });

