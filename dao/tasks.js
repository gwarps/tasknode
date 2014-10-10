/**
* This file is isolated and not in use anymore in main project
**/
/* The TasksDAO must be constructed with a connected database object */
var ObjectID = require('mongodb').ObjectID;

function TasksDAO(db) {
   "use strict";

   /* If this constructor is called without the "new" operator, "this" points
    * to the global object. Log a warning and call it correctly. */
   if (false === (this instanceof TasksDAO)) {
      console.log("Warning: TasksDAO constructor called without new operator");
      return new TasksDAO(db);
   }


   var tasks = db.collection("tasks");

   this.getTasks = function(query, callback) {
      "use strict";

      query = typeof query !== 'undefined' ? query : {};
      
      tasks.find(query).toArray(function(err, items) {
         if (err) return callback(err, null);

         console.log("Found " + items.length + " tasks");

         callback(err, items);
      });
   }


   this.getTaskByID = function(query, callback) {
      "use strict";
      //var query = {_id : new ObjectID(_id)};
      tasks.findOne(query, function(err, task) {
         "use strict";
         if (err) return callback(err, null);

         callback(err, task);
      });
   }

   this.createTask = function(doc, callback) {
      "use strict";
      tasks.insert(doc, function(err, inserted) {
         if (err) return callback(err, null);
         console.log("Successfully inserted: " + JSON.stringify(inserted));
        
         callback(err, inserted);
      });
   }

   this.deleteTask = function(query, callback) {
      "use strict";
      //var query = {_id : new ObjectID(_id)};
      tasks.remove(query, function(err, removed) {
         if (err) throw err;
         console.log("successfully removed " + removed + " documents");
      });
   }


}


module.exports.TasksDAO = TasksDAO;
