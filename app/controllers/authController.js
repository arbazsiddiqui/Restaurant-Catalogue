var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middlewares/isLoggedIn');
var path = require('path');

module.exports = function (passport) {

  router.get('/', function (req, res) {
    res.render('home.ejs');
  });

  router.get('/login', function (req, res) {
    res.render('login.ejs');
  });

  router.get('/signup', function (req, res) {
    res.render('signup.ejs');
  });

  router.get('/home', isLoggedIn, function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../../public/app/views/index.html'));
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/login'
  }));

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home',
    failureRedirect: '/signup'
  }));

  router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect : '/'
  }));

  router.get('logout', function (req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
