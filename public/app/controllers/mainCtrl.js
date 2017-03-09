angular.module('mainCtrl', [])
  .controller('MainController', function ($scope, Search) {
    
    $scope.searchQuery = "";
    $scope.facetQuery = "";
    $scope.gt = "";
    $scope.lt = "";
    $scope.facetFlag  = 0;
    $scope.restaurantNames = [];
    Search.all()
      .success(function (data) {
        $scope.restaurantNames = data;
      });

    //searching by name auto
    $scope.nameSearchAuto = function () {
      if($scope.searchQuery.title)
        searchQuery = $scope.searchQuery.title;
      else
        searchQuery = $scope.searchQuery.originalObject;
      var params = {
        qs : searchQuery
      };
      Search.nameSearch(params)
        .success(function (data) {
          $scope.searchResults = data
        })
    };

    //searching by name
    $scope.nameSearch = function () {
      var params = {
        qs : $scope.searchQuery
      };
      Search.nameSearch(params)
        .success(function (data) {
          $scope.searchResults = data
        })
    };

    //searching by facets
    $scope.facetedSearch = function () {
      $scope.facetFlag  = 1;
      var params = {
        qs : $scope.facetQuery
      };
      Search.facetedSearch(params)
        .success(function (data) {
          makeFacets(data);
        })
    }
    
    var makeFacets = function (data) {
      $scope.checkboxModel = {};

      var boroughs = {};
      var bBuckets = data.aggregations.boroughs.buckets;
      for (i=0; i<bBuckets.length; i++){
        boroughs[bBuckets[i].key] = {
          "count" : bBuckets[i].doc_count,
          "source" : bBuckets[i].hits.hits.hits
        };
        $scope.checkboxModel[bBuckets[i].key] = 'NO'
      }

      var cuisines = {};
      var cBuckets = data.aggregations.cuisines.buckets;
      for (var j=0; j<cBuckets.length; j++){
        cuisines[cBuckets[j].key] = {
          "count" : cBuckets[j].doc_count,
          "source" : cBuckets[j].hits.hits.hits
        };
        $scope.checkboxModel[cBuckets[j].key] = 'NO'
      }
      $scope.boroughs = boroughs;
      $scope.cuisines = cuisines;
    };

    $scope.facetResults = [];
    $scope.showHideResults = function (facetType, bucket) {
      if($scope.checkboxModel[bucket] == 'YES'){
        for(i =0; i<$scope[facetType][bucket].source.length; i++){
          $scope.facetResults.push($scope[facetType][bucket].source[i]);
        }
      }
      if($scope.checkboxModel[bucket] == 'NO'){
        for(i =$scope.facetResults.length-1; i>=0; i--){
          if($scope.facetResults[i]._source[facetType.slice(0, -1)].toLowerCase() == bucket.toLowerCase())
            $scope.facetResults.splice(i, 1);
        }
      }
      console.log($scope.facetResults)
    };

    //searching by grade
    $scope.gradeSearch = function () {
      var params = {
        gt : $scope.gt,
        lt : $scope.lt
      };
      Search.gradeSearch(params)
        .success(function (data) {
          $scope.gradeResults = data
        })
    };
  });