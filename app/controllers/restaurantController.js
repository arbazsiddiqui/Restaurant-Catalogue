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

router.post('/gradeSearch', function (req, res) {
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

router.get('/allRestaurant', isLoggedIn, function (req, res) {
  restaurants = Resturant.getAll(function (restaurants) {
    return res.json(restaurants);
  });
});


module.exports = router;