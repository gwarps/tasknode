var Task = require("../models/task");


module.exports = function (app, passport) {
    "use strict";
    app.get("/tasks", function (req, res, next) {
        if (req.isAuthenticated()) {
            Task.find({ author: req.user._id }, function (err, docs) {
                if (err) { throw err; }
                res.render("tasks", {"tasks": docs, 
                                      message: req.flash('info'),
                                      userinfo: req.userinfo});
            });
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

    app.get("/task/:id", function (req, res, next) {
        if (req.isAuthenticated()) {
            var query = {_id: req.params.id, author: req.user._id};
            Task.findOne(query, function (err, doc) {
                if (err) { throw err; }
                res.render("task", {"task": doc,
                                    userinfo: req.userinfo});
            });
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

    app.post("/task", function (req, res, next) {
        if (req.isAuthenticated()) {
            var task = new Task();

            task.taskCode = req.body.taskCode;
            task.taskSubCode = req.body.taskSubCode;
            task.taskDesc = req.body.taskDescription;
            task.created = new Date();
            task.updated = new Date();
            task.author = req.user._id

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
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });


   /**
   Delete task from the task list
   **/
    app.delete("/task/:id", function (req, res, next) {
        if (req.isAuthenticated()) {
            var query = {_id: req.params.id, author: req.user._id};
            Task.remove(query, function (err, docsDeleted) {
                if (err) { throw err; }
                console.log("total docs deleted: " + docsDeleted);
                console.log("redirection pending again");
            });
        } else {
            // message disabled since ajax request
            //req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

};
