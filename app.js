var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');


// Customized for openshift
//var port = process.env.PORT || 3000
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

// get index routes
//var index = require('./routes/index');
//var task = require('./routes/task');

var MONGO_SERVER_URL = "mongodb://localhost:27017";
if(process.env.OPENSHIFT_MONGODB_DB_URL) {
   MONGO_SERVER_URL = process.env.OPENSHIFT_MONGODB_DB_URL;
}

var DB_INSTANCE = "journal"
var CONNECT_STRING = MONGO_SERVER_URL + "/" + DB_INSTANCE;

var app = express();
var routes = require('./routes');

// mongoose connection management
mongoose.connect(CONNECT_STRING);
mongoose.connection.on('connected', function() {
   console.log("Mongoose default connection open now");
});

mongoose.connection.on('error',function (err) {
   console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
   console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
   mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
   });
});



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
   app.use(session({ 
      cookie: { maxAge: 60000 },
      resave: true,
      saveUninitialized: true,
      secret: "reptile"
   }));
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


   var server = app.listen(server_port, server_ip_address,  function() {
      //console.log('Listening on port %d', server.address().port);
      console.log("Listening on " + server_ip_address + ", server_port " + server_port);
   });
});
