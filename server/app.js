var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

//import /routes
var index = require('./routes/index');
var news = require('./routes/news');
var auth = require('./routes/auth');

var app = express();

// import the auth_checker middleware
var authCheckerMiddleware = require('./middleware/auth_checker');

// convert string to json, middleware
app.use(bodyParser.json());

// import config.json
var config = require('./config/config.json');
// connect to mongoDB
require('./models/main').connect(config.mongoDbUri);

var passport = require('passport');
app.use(passport.initialize()); // required middleware when using passport
var localSignUpStrategy = require('./passport/sign_up_passport');
var localLoginStrategy = require('./passport/login_passport');
// give two strageties a name
passport.use('local-signup', localSignUpStrategy);
passport.use('local-login', localLoginStrategy);

// remove this after development
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// enalbe cross origin

// Routing
app.use('/static', express.static(path.join(__dirname, '../client/build/static')));
app.use('/', index);
app.use('/auth', auth);
app.use('/news', authCheckerMiddleware); // use authCheckerMiddleware for /news API
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;