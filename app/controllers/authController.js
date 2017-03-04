var express = require('express');
var router = express.Router();

module.exports = function (passport) {

  router.post('/login', passport.authenticate('local-login'), function (req, res) {
    if (req.user)
      return res.json(req.user);
  });

  router.post('/signup', passport.authenticate('local-signup'), function (req, res) {
    if (req.user)
      return res.json(req.user);
  });

  router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  router.get('/auth/google/callback', passport.authenticate('google'), function (req, res) {
    if (req.user)
      return res.json(req.user);
  });

  return router;
};
