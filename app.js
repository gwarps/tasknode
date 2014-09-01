var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var port = process.env.PORT || 3000

// get index routes
//var index = require('./routes/index');
//var task = require('./routes/task');

var MONGO_SERVER_URL = "mongodb://slc05akl.us.oracle.com:27017";
var DB_INSTANCE = "journal"
var CONNECT_STRING = MONGO_SERVER_URL + "/" + DB_INSTANCE;

var app = express();
var routes = require('./routes');

MongoClient.connect(CONNECT_STRING, function(err, db) {
  // setup view engine
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'jade');
   
   app.use(logger('dev'));
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({extended: true}));
   app.use(require('stylus').middleware(path.join(__dirname, 'public')));
   app.use(express.static(path.join(__dirname, 'public')));

   app.use(cookieParser('secret'));
   app.use(session({ cookie: { maxAge: 60000 }}));
   app.use(flash());   


   routes(app, db);
   
   // setting resourceful routes
   //app.use('/', index);
   //app.use('/task', task);
   
   //app.get('/', function(req, res){
   //  res.send('Hello World');
   //});
   
   if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
         res.status(err.status || 500);
         res.render('error', {
             message: err.message,
             error: err
         });
      });
    
      app.locals.pretty = true;
   }


   var server = app.listen(port, function() {
      console.log('Listening on port %d', server.address().port);
   });
});
