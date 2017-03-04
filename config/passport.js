var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');
var User = require('../app/models/user');
module.exports = function (passport) {

  // passport session setup ==================================================
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // LOCAL SIGNUP ============================================================
  passport.use('local-signup', new LocalStrategy({

      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {

      process.nextTick(function () {

        User.findOne({'local.email': email}, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false);
          } else {
            var newUser = new User();
            newUser.local.name = req.body.name;
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  // LOCAL LOGIN =============================================================
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({'local.email': email}, function (err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false);
        if (!user.validPassword(password))
          return done(null, false);
        return done(null, user);
      });
    }));

  // GOOGLE ==================================================================
  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
    },
    function (token, refreshToken, profile, done) {
      console.log(profile)
      process.nextTick(function () {

        User.findOne({'google.id': profile.id}, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            // save the user
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));
};

