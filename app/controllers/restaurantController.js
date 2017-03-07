var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var Resturant = require('../models/restaurant');
var isLoggedIn = require('../middlewares/isLoggedIn');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

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

router.post('/facetedSearch', function (req, res) {
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
          "terms": {"field": "cuisine"},
          "aggregations": {
            "hits": {
              "top_hits": { "size": 10 }
            }
          }
        },
        "boroughs": {
          "terms": {"field": "borough"},
          "aggregations": {
            "hits": {
              "top_hits": { "size": 10 }
            }
          }
        }
      }
    }
  }).then(function (resDoc) {
    var results = {};
    results.hits= resDoc.hits;
    results.aggregations = resDoc.aggregations;
    return res.json(results)
  })
});

router.get('/allRestaurant', isLoggedIn, function (req, res) {
  restaurants = Resturant.getAll(function (restaurants) {
    return res.json(restaurants);
  });
});


module.exports = router;