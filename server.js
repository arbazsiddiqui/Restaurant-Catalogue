// set up ======================================================================
var express = require('express');
var path = require('path');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// configuration ===============================================================
mongoose.connect(database.url);
require('./config/passport')(passport);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(cookieParser());

var auth = require('./app/controllers/authController')(passport);
var restaurant = require('./app/controllers/restaurantController');
// required for passport
app.use(session({
  secret: 'starwarsspoiler',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// routes ======================================================================
app.use('/', auth);
app.use('/restaurant', restaurant);
// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
