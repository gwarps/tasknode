var PostsDAO = require("../dao/posts").PostsDAO;
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
   var posts = new PostsDAO(db);

   app.get("/posts", function(req, res, next) {
      posts.getPosts({}, function(err, docs) {
         if (err) throw err;
         res.render("posts", {"posts" : docs});    
      });
   });


   app.get("/post/edit/:id", function(req, res, next) {
      var query = {_id: new ObjectID(req.params.id)};

      posts.getPostByID(query, function(err, doc) {
         if (err) throw err;

         doc.tags = doc.tags.join().toString();
         res.render("post_edit", {"post" : doc});
      });
   });

   app.post("/post", function(req, res, next) {
      "use strict";
      var taskCode = req.body.taskCode;
      var taskSubCode = req.body.taskSubCode;
      var postText = req.body.postText;
      var postTags = req.body.postTags;

      var postAuthor = "puneet.s.singh@oracle.com";

      var cleaned = [];
      var tags_array = postTags.split(",");

      for (var i = 0; i < tags_array.length; i++) {
         if((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
            cleaned.push(tags_array[i].replace(/\s/g,''));
         }
      }
     
      var doc = {
                   "taskCode": taskCode,
                   "taskSubCode": taskSubCode,
                   "postText": postText,
                   "tags" : cleaned,
                   "author": postAuthor,
                   "created": new Date(),
                   "updated": new Date()
                };
      posts.createPost(doc, function(err, inserted) {
         console.log("redirection pending");
      });

   });

   app.post("/post/edit/:id", function(req, res, next) {
      "use strict";
      var taskCode = req.body.taskCode;
      var taskSubCode = req.body.taskSubCode;
      var postText = req.body.postText;
      var postTags = req.body.postTags;
      var query = {_id: new ObjectID(req.params.id)};
 
    
      var cleaned = [];

      var tags_array = postTags.split(",");

      for (var i = 0; i < tags_array.length; i++) {
         if((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
            cleaned.push(tags_array[i].replace(/\s/g,''));
         }
      }
      posts.getPostByID(query, function(err, doc) {
         if(!doc) {
            console.log("No documents assigned for " + query);
            return;
         }
         query._id = doc._id;

         doc.taskCode = taskCode;
         doc.taskSubCode = taskSubCode;
         doc.postText = postText;
         doc.tags = cleaned;
         doc.updated = new Date();

         posts.updatePost(query, doc, function(err, updated) {
            console.log("Successfully updated " + updated + " document!");
         });
         res.redirect("/posts");
      }); 
   });

   app.delete("/post/:id", function(req, res, next) {
      "use strict";
       var query = {_id: new ObjectID(req.params.id)};
       posts.deletePost(query, function(err, removed) {
          console.log("redirection pending");
       });
   });

}
