var PostsDAO = require("../dao/posts").PostsDAO;
var ObjectID = require('mongodb').ObjectID;

var Post = require('../models/post');

module.exports = function(app, db) {
   var posts = new PostsDAO(db);
   /**
   * GET all posts
   **/
   app.get("/posts", function(req, res, next) {
      Post.find({}, function(err, docs) {
         if (err) throw err;
         res.render("posts", {"posts" : docs});    
      });
   });

   /**
   * GET a post by id, where id is object id (_id)
   **/
   app.get("/post/edit/:id", function(req, res, next) {
     "use strict";  
   
      var query = {_id: req.params.id};

      Post.findOne(query, function(err, doc) {
         if (err) throw err;

         doc.tags = doc.tags.join().toString();
         res.render("post_edit", {"post" : doc});
      });
   });

   /**
   * POST data for a post to create a post
   **/
   app.post("/post", function(req, res, next) {
      "use strict";
      var post = new Post();

      post.taskCode = req.body.taskCode;
      post.taskSubCode = req.body.taskSubCode;
      post.postText = req.body.postText;
      //post.tags = req.body.postTags;

      post.author = ObjectID(1);
      post.created = new Date();
      post.updated = new Date();

      var cleaned = [];
      var tags_array = req.body.postTags.split(",");

      for (var i = 0; i < tags_array.length; i++) {
         if((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
            cleaned.push(tags_array[i].replace(/\s/g,''));
         }
      }
     
      post.tags = cleaned;
      
      post.save(function(err, doc, noDocAffected) {
         if (err) {
            throw err;
         } else {
            console.log("pending impl...");
         }
         console.log("redirection pending");
      });

   });

   app.post("/post/edit/:id", function(req, res, next) {
      "use strict";
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
      
      var update = {
                      "taskCode": req.body.taskCode,
                      "taskSubCode": req.body.taskSubCode,
                      "postText": req.body.postText,
                      "tags": cleaned,
                      "updated": new Date()

                   };

      Post.findByIdAndUpdate(req.params.id, update, function(err, doc) {
        if(err) throw err;
        console.log(doc + "updated");
        res.redirect("/posts"); 
      });
   });

   /**
   * DELETE a post from post list
   **/
   app.delete("/post/:id", function(req, res, next) {
      "use strict";
       Post.findByIdAndRemove(req.params.id, function(err) {
          if (err) throw err;
          console.log("redirection pending");
       });
   });

}
