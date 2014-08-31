/* The PostsDAO must be constructed with a connected database object */
var ObjectID = require('mongodb').ObjectID;

function PostsDAO(db) {
   "use strict"

     /* If this constructor is called without the "new" operator, "this" points
      * to the global object. Log a warning and call it correctly. */
   if (false === (this instanceof PostsDAO)) {
      console.log("Warning: PostsDAO constructor called without new operator");
      return new PostsDAO(db);
   }

   var posts = db.collection("posts");

   this.getPosts = function(query, callback) {
      "use strict";

      query = typeof query !== 'undefined' ? query : {};

      posts.find(query).toArray(function(err, items) {
         if (err) return callback(err, null);

         console.log("Found " + items.length + " posts");

         callback(err, items);
      });
   }

   this.getPostByID = function(query, callback) {
      "use strict";
      posts.findOne(query, function(err, post) {
         "use strict";
         if (err) return callback(err, null);

         callback(err, post);
      });
   }

   this.createPost = function(doc, callback) {
      "use strict";
      posts.insert(doc, function(err, inserted) {
         if (err) return callback(err, null);
         console.log("Successfully inserted: " + JSON.stringify(inserted));
         
         callback(err, inserted);
      });
   }

   this.updatePost = function(query, doc, callback) {
      "use strict";
      posts.update(query, doc, function(err, updated) {
         if (err) return callback(err, null);
         console.log("Successfully updated " + updated + " document!");
         
         callback(err, updated);
      });
   }

   this.deletePost = function(query, callback) {
      "use strict";
      posts.remove(query, function(err, removed) {
         if (err) throw err;
         console.log("successfully removed " + removed + " documents");

         callback(err, removed);
      });
   }

}

module.exports.PostsDAO = PostsDAO;
