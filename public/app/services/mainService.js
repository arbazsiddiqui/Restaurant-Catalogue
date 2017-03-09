angular.module('mainService', [])

  .factory('Search', function ($http) {
    var searchFactory = {};

    searchFactory.all = function () {
      return $http.get('/restaurant/allRestaurant');
    };

    searchFactory.searchByName = function (body) {
      return $http.post('/restaurant/search', body); 
    };

    searchFactory.facetedSearch = function (body) {
      return $http.post('/restaurant/facetedSearch', body);
    };

    return searchFactory;
  });

