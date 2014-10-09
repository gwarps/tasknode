var TasksDAO = require("../dao/tasks").TasksDAO;
var ObjectID = require('mongodb').ObjectID;

var Task = require("../models/task");


module.exports = function(app, db) {
   var tasks = new TasksDAO(db);

   app.get("/tasks", function(req, res, next) {
      Task.find({}, function(err, tasks) {
         if (err) throw err;
         res.render("tasks", {"tasks": tasks, message: req.flash('info')});
      });
   });

   app.get("/task/:id", function(req, res, next) {
      //var _id = req.params.id;
      var query = {_id: new ObjectID(req.params.id)};
      tasks.getTaskByID(query, function(err, doc) {
         if (err) throw err;
         res.render("task", {"task" :  doc});
      });
   });

   app.post("/task", function(req, res, next) {
      var taskCode = req.body.taskCode;
      var taskSubCode = req.body.taskSubCode;
      var taskDesc = req.body.taskDescription;

      var doc = {
                   "taskCode": taskCode,
                   "taskSubCode": taskSubCode,
                   "taskDesc": taskDesc,
                   "created": new Date(),
                   "updated": new Date()
                };
      tasks.createTask(doc, function(err, inserted) {
         // console.log("redirection for task update pending");
         req.flash('info', 'Task created under task code: ' + taskCode);
         res.redirect('/tasks');
      });
   });

   app.delete("/task/:id", function(req, res, next) {
      var query = {_id: new ObjectID(req.params.id)};
      tasks.deleteTask(query, function(err, removed) {
         console.log("redirection pending again");
      }); 

   }); 

}
