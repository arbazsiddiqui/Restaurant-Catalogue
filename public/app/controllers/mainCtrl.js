angular.module('mainCtrl', [])
  .controller('MainController', function ($scope, Search, geolocationSvc) {

    $scope.searchQuery = "";
    $scope.facetQuery = "";
    $scope.gt = "";
    $scope.lt = "";
    $scope.lon = "";
    $scope.lat = "";
    $scope.facetFlag = 0;
    $scope.geoFlag = 0;
    $scope.restaurantNames = [];
    $scope.facetResults = [];
    $scope.tab = 1;
    $scope.selectedobject = "a";

    //populate names for autoComplete
    Search.all()
      .success(function (data) {
        $scope.restaurantNames = data;
      });

    //searching by name
    $scope.nameSearchAuto = function () {
      $scope.facetResults = [];
      if ($scope.searchQuery.title)
        $scope.searchQuery = $scope.searchQuery.title;
      else if ($scope.searchQuery.originalObject)
        $scope.searchQuery = $scope.searchQuery.originalObject;

      var params = {
        qs: $scope.searchQuery
      };
      Search.nameSearch(params)
        .success(function (data) {
          $scope.searchResults = data
        })
    };

    //searching by facets
    $scope.facetedSearch = function () {
      $scope.searchResults = "";
      $scope.facetFlag = 1;
      var params = {
        qs: $scope.facetQuery
      };
      Search.facetedSearch(params)
        .success(function (data) {
          makeFacets(data);
        })
    };

    //function to make facets on results and checkbox model for it.
    var makeFacets = function (data) {
      $scope.checkboxModel = {};

      var boroughs = {};
      var bBuckets = data.aggregations.boroughs.buckets;
      for (i = 0; i < bBuckets.length; i++) {
        boroughs[bBuckets[i].key] = {
          "count": bBuckets[i].doc_count,
          "source": bBuckets[i].hits.hits.hits
        };
        $scope.checkboxModel[bBuckets[i].key] = 'NO'
      }
      var cuisines = {};
      var cBuckets = data.aggregations.cuisines.buckets;
      for (var j = 0; j < cBuckets.length; j++) {
        cuisines[cBuckets[j].key] = {
          "count": cBuckets[j].doc_count,
          "source": cBuckets[j].hits.hits.hits
        };
        $scope.checkboxModel[cBuckets[j].key] = 'NO'
      }
      $scope.boroughs = boroughs;
      $scope.cuisines = cuisines;
    };

    //function to push and pull facetresult based on facet selection
    $scope.showHideResults = function (facetType, bucket) {
      if ($scope.checkboxModel[bucket] == 'YES') {
        for (i = 0; i < $scope[facetType][bucket].source.length; i++) {
          $scope.facetResults.push($scope[facetType][bucket].source[i]);
        }
      }
      if ($scope.checkboxModel[bucket] == 'NO') {
        for (i = $scope.facetResults.length - 1; i >= 0; i--) {
          if ($scope.facetResults[i]._source[facetType.slice(0, -1)].toLowerCase() == bucket.toLowerCase())
            $scope.facetResults.splice(i, 1);
        }
      }
    };

    //searching by avg score
    $scope.gradeSearch = function () {
      $scope.facetResults = [];
      var params = {
        gt: $scope.gt,
        lt: $scope.lt
      };
      Search.gradeSearch(params)
        .success(function (data) {
          $scope.searchResults = data
        })
    };

    //searching by location latitude and longitude
    $scope.geoSearch = function () {
      $scope.facetResults = [];
      $scope.geoFlag = 1;
      var params = {
        lon: $scope.lon,
        lat: $scope.lat
      };
      Search.geoSearch(params)
        .success(function (data) {
          $scope.searchResults = data
        })
    };

    //searching by location nearby
    $scope.getLocation = function () {
      $scope.facetResults = [];
      $scope.geoFlag = 1;
      geolocationSvc.getCurrentPosition().then(
        function (position) { //
          $scope.lon = position.coords.longitude;
          $scope.lat = position.coords.latitude;
          $scope.geoSearch();
        }
      );
    };
    
    //functions for tab selection
    $scope.setTab = function (newTab) {
      $scope.tab = newTab;
    };
    $scope.isSet = function (tabNum) {
      return $scope.tab === tabNum;
    };

  });