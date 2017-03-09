angular.module('mainService', [])

  .factory('Search', function ($http) {
    var searchFactory = {};

    searchFactory.all = function () {
      return $http.get('/restaurant/allRestaurant');
    };

    searchFactory.nameSearch = function (body) {
      return $http.post('/restaurant/search', body); 
    };

    searchFactory.facetedSearch = function (body) {
      return $http.post('/restaurant/facetedSearch', body);
    };

    searchFactory.gradeSearch = function (body) {
      return $http.post('/restaurant/gradeSearch', body);
    };

    return searchFactory;
  });

