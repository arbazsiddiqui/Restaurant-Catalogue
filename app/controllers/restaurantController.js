var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var Resturant = require('../models/restaurant');
var isLoggedIn = require('../middlewares/isLoggedIn');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

//name based search
router.post('/search', isLoggedIn, function (req, res) {
  searchQuery = req.body.qs;
  client.search({
    index: 'restaurants',
    type: 'restaurant',
    body: {
      "query": {
        "query_string": {
          "default_field": "name",
          "query": '*' + searchQuery + '*'
        }
      }
    }
  }).then(function (resDoc) {
    return res.json(resDoc.hits)
  })
});

//faceted search
router.post('/facetedSearch', isLoggedIn, function (req, res) {
  searchQuery = req.body.qs;
  client.search({
    index: 'restaurants',
    type: 'restaurant',
    body: {
      "query": {
        "query_string": {
          "default_field": "name",
          "query": '*' + searchQuery + '*'
        }
      },
      "aggs": {
        "cuisines": {
          "terms": {"field": "cuisine.raw"},
          "aggregations": {
            "hits": {
              "top_hits": {"size": 10}
            }
          }
        },
        "boroughs": {
          "terms": {"field": "borough.raw"},
          "aggregations": {
            "hits": {
              "top_hits": {"size": 10}
            }
          }
        }
      }
    }
  }).then(function (resDoc) {
    var results = {};
    results.hits = resDoc.hits;
    results.aggregations = resDoc.aggregations;
    return res.json(results)
  })
});

//avg score based search
router.post('/gradeSearch', isLoggedIn, function (req, res) {
  gt = parseInt(req.body.gt);
  lt = parseInt(req.body.lt);
  var script = "if (_source.grades == null){return false}; m=0; s=_source.grades.size(); if(s==0){return false}; for(obj in _source.grades){ m += obj.score;}; avg=m.div(s);if(avg>=gt && avg<=lt){return avg}";
  client.search({
    index: 'restaurants',
    type: 'restaurant',
    body: {
      "query": {
        "filtered": {
          "filter": {
            "script": {
              "script": script,
              "params": {
                "gt": gt,
                "lt": lt
              }
            }
          }
        }
      },
      "script_fields": {
        "avgScore": {
          "script": script,
          "params": {
            "gt": gt,
            "lt": lt
          }
        }
      },
      "_source": true
    }
  }).then(function (resDoc) {
    return res.json(resDoc.hits)
  })
});

//location based search
router.post('/geoSearch', isLoggedIn, function (req, res) {
  lon = parseFloat(req.body.lon);
  lat = parseFloat(req.body.lat);
  client.search({
    index: 'restaurants',
    type: 'restaurant',
    body: {
      "query": {
        "nested": {
          "path": "address",
          "query": {
            "filtered": {
              "filter": {
                "geo_distance": {
                  "distance": "1km",
                  "address.coord": [lon, lat]
                }
              }
            }
          }
        }
      }
    }
  }).then(function (resDoc) {
    return res.json(resDoc.hits)
  })
});

//get all restaurant names for autocomplete
router.get('/allRestaurant', isLoggedIn, function (req, res) {
  restaurants = Resturant.getAllNames(function (restaurants) {
    return res.json(restaurants);
  });
});


module.exports = router;