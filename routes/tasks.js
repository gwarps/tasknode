var Task = require("../models/task");


module.exports = function (app) {
    "use strict";
    app.get("/tasks", function (req, res, next) {
        Task.find({}, function (err, docs) {
            if (err) { throw err; }
            res.render("tasks", {"tasks": docs, message: req.flash('info')});
        });
    });

    app.get("/task/:id", function (req, res, next) {
        var query = {_id: req.params.id};
        Task.findOne(query, function (err, doc) {
            if (err) { throw err; }
            res.render("task", {"task": doc});
        });
    });

    app.post("/task", function (req, res, next) {
        var task = new Task();

        task.taskCode = req.body.taskCode;
        task.taskSubCode = req.body.taskSubCode;
        task.taskDesc = req.body.taskDescription;
        task.created = new Date();
        task.updated = new Date();

        //console.log(task);

        task.save(function (err, doc, noDocsAffected) {
            if (err) {
                req.flash('info', 'Oops. seems to be some problem: ' + err);
                console.log(err);
            } else {
                req.flash('info', 'Task created under task code: ' + task.taskCode);
            }
            res.redirect('/tasks');
        });
    });


   /**
   Delete task from the task list
   **/
    app.delete("/task/:id", function (req, res, next) {
        Task.findByIdAndRemove(req.params.id, function (err) {
            if (err) { throw err; }
            console.log("redirection pending again");
        });
    });

};
