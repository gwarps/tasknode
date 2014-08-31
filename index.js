var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var Server = mongo.Server;


var MONGO_SERVER_URL = "mongodb://slc05akl.us.oracle.com:27017";
var DB_INSTANCE = "journal"
var CONNECT_STRING = MONGO_SERVER_URL + "/" + DB_INSTANCE;
var ObjectID = mongo.ObjectID;

var mongoclient = new MongoClient(new Server('localhost', 27017, {'native_parser' : true}));
var db = mongoclient.db('journal');
// get home page
router.get('/', function(req, res) {
   res.render('index', {title: 'Express'});
});


router.get('/docs', function(req, res) {
   res.render('docs');
});

// Get a particular task details
router.get('/task/:id', function(req, res) {
   console.log('get task');
   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var query = {_id : new ObjectID(req.params.id)};
      console.log(query);
      db.collection("tasks").findOne(query, function(err, doc) {
         if(err) throw err;
         console.log(doc);
         res.render("task", {"task" : doc}); 
      }); 
   });
});

// create a task
router.post('/task', function(req, res, next) {
   var taskCode = req.body.taskCode;
   var taskSubCode = req.body.taskSubCode;
   var taskDesc = req.body.taskDescription;
   
   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var doc = {
                   "taskCode": taskCode,
                   "taskSubCode": taskSubCode,
                   "taskDesc": taskDesc,
                   "created": new Date(),
                   "updated": new Date()
                };
      //console.log(doc);
      db.collection('tasks').insert(doc, function(err, inserted) {
         console.dir("Successfully Inserted: " + JSON.stringify(inserted));

      });
   });
   
   
});

//delete a task
router.delete('/task/:id', function(req, res, next) {
   console.log("delete");
   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var query = {_id: new ObjectID(req.params.id)};
      db.collection("tasks").remove(query, function(err, removed) {
         if(err) throw err;
         console.log("Successfully removed " + removed + " documents!");
         return db.close();
      });
      
   });
});


//get all the tasks
router.get('/tasks', function(req, res, next) {

   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var query = {};
      var projection = {};
      db.collection("tasks").find(query, projection).toArray(function(err, docs) {
         if(err) throw err;
         console.log(docs);
         res.render("tasks", {"tasks" : docs});
      });
   });
   //res.render('tasks');
});

//get all the posts
router.get('/posts', function(req, res, next) {

   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var query = {};
      var projection = {};
      db.collection("posts").find(query, projection).toArray(function(err, docs) {
         if(err) throw err;
         console.log(docs);
         res.render("posts", {"posts" : docs});
      });
   });
   //res.render('tasks');
});

// create a post
router.post('/post', function(req, res, next) {

   console.log("tags hit");
   var taskCode = req.body.taskCode;
   var taskSubCode = req.body.taskSubCode;
   var postText = req.body.postText;
   var postTags = req.body.postTags;

   var postAuthor = "puneet.s.singh@oracle.com";

   var cleaned = [];
   console.log(typeof(postTags));
   console.log(postTags);
   var tags_array = postTags.split(",");

   for (var i = 0; i < tags_array.length; i++) {
      if((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
         cleaned.push(tags_array[i].replace(/\s/g,''));
      }
   }

   
   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var doc = {
                   "taskCode": taskCode,
                   "taskSubCode": taskSubCode,
                   "postText": postText,
                   "tags" : cleaned,
                   "author": postAuthor,
                   "created": new Date(),
                   "updated": new Date()
                };
      console.log(doc);
      db.collection('posts').insert(doc, function(err, inserted) {
         console.dir("Successfully Inserted: " + JSON.stringify(inserted));

      });
   });   
});

// Show edit post screen
router.get('/post/edit/:id', function(req, res, next) {
   console.log("post edit screen");
   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var query = {_id: new ObjectID(req.params.id)};
      db.collection("posts").findOne(query, function(err, doc) {
         if(err) throw err;

         doc.tags = doc.tags.join().toString();
         res.render("post_edit", {"post" : doc});
         return db.close();
      });
      
   });
});


router.post('/post/edit/:id', function(req, res, next) {
   console.log("post update");

   var taskCode = req.body.taskCode;
   var taskSubCode = req.body.taskSubCode;
   var postText = req.body.postText;
   var postTags = req.body.postTags;

   var cleaned = [];
 
   var tags_array = postTags.split(",");

   for (var i = 0; i < tags_array.length; i++) {
      if((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
         cleaned.push(tags_array[i].replace(/\s/g,''));
      }
   }



   //console.log(taskCode);
   //console.log(taskSubCode);

   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      
      var query = {_id: new ObjectID(req.params.id)};
      db.collection("posts").findOne(query, function(err, doc) {
         if(err) throw err;

         if(!doc) {
            console.log("No documents assigned for " + query);
            return db.close();
         }
         console.log(doc);
         query._id = doc._id;

         doc.taskCode = taskCode;
         doc.taskSubCode = taskSubCode;
         doc.postText = postText;
         doc.tags = cleaned;
         doc.updated = new Date();

         db.collection("posts").update(query, doc, function(err, updated) {
            if(err) throw err;
            console.log("Successfully updated " + updated + " document!");
            return db.close();
         });
         // res.render("post_edit", {"post" : doc});
         res.redirect("http://slc05akl.us.oracle.com:3000/posts");
         //return db.close();
      });
      
   });
});

router.delete('/post/:id', function(req, res, next) {
   console.log("delete post");
   MongoClient.connect(CONNECT_STRING, function(err, db) {
      if(err) throw err;
      var query = {_id: new ObjectID(req.params.id)};
      db.collection("posts").remove(query, function(err, removed) {
         if(err) throw err;
         console.log("Successfully removed " + removed + " documents!");
         return db.close();
      });
   });
});


module.exports = router;
