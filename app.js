var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongo = require('mongodb');

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  // mongoose connect for heroku
  var dbMonk = require('monk')(process.env.MONGOLAB_URI);
} else {
  var dbMonk = require('monk')('localhost/nodeauth');
}

var mongoose = require('mongoose');
var db = mongoose.connection;
var multer = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express();
app.set('port', process.env.PORT || 3000);
app.locals.moment = require('moment');

app.locals.truncateText = function(text, length) {
  var truncatedText = text.substring(0, length);
  return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Handle File Uploads
//app.use(multer({dest:'./uploads/'}));
app.use(multer({
  dest: './public/images/uploads'
}).single('mainimage'));
//var upload = multer({ dest: './public/images/uploads' }).single('mainimage');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Handle Express Sessions
app.use(session({
  secret: 'tripfontain',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Make db accessible to out router
app.use(function(req, res, next) {
  req.dbMonk = dbMonk;
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

if (process.env.PORT === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;