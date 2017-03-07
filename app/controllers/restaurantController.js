var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var Resturant = require('../models/restaurant');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

router.post('/search', function (req, res) {
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

router.get('/allRestaurant', function (req, res) {
  restaurants = Resturant.getAll(function (restaurants) {
    return res.json(restaurants);
  });
});


module.exports = router;