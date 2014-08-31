var TasksDAO = require("../dao/tasks").TasksDAO;
module.exports = function(app, db) {
   var tasks = new TasksDAO(db);

   app.get("/tasks", function(req, res, next) {
      tasks.getTasks({}, function(err, docs) {
         if (err) throw err;
         res.render("tasks", {"tasks" : docs});
      });
   });

}
