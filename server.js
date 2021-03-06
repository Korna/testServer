var express        = require('express');
var app            = express();
var port = 8000;

var MongoClient    = require('mongodb').MongoClient;
var bodyParser     = require('body-parser');
var dbUrl             = require('./config/db');

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect(dbUrl.url); //'mongodb://localhost/testForAuth'
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});



//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(dbUrl.url, (err, database) => {
  var db = database.db('dbtest');

  if (err) return console.log(err)

  require('./routes')(app, db);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });

});


/*
// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

*/