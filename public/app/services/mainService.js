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

    searchFactory.geoSearch = function (body) {
      return $http.post('/restaurant/geoSearch', body);
    };

    return searchFactory;
  })

  .factory('geolocationSvc', ['$q', '$window', function ($q, $window) {
    'use strict';
    function getCurrentPosition() {
      var deferred = $q.defer();

      if (!$window.navigator.geolocation) {
        deferred.reject('Geolocation not supported.');
      } else {
        $window.navigator.geolocation.getCurrentPosition(
          function (position) {
            deferred.resolve(position);
          },
          function (err) {
            deferred.reject(err);
          });
      }

      return deferred.promise;
    }

    return {
      getCurrentPosition: getCurrentPosition
    };
  }]);

