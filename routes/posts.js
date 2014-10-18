var ObjectID = require('mongodb').ObjectID;

var Post = require('../models/post');

module.exports = function (app) {
    "use strict";
    /**
    * GET all posts
    **/
    app.get("/posts", function (req, res, next) {
        if (req.isAuthenticated()) {
            Post.find({ author: req.user._id }, function (err, docs) {
                if (err) { throw err; }
                res.render("posts", {"posts": docs,
                           userinfo: req.userinfo});
            });
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

    /**
    * GET a post by id, where id is object id (_id)
    **/
    app.get("/post/edit/:id", function (req, res, next) {
        if (req.isAuthenticated()) {

            var query = { _id: req.params.id, author: req.user._id };

            Post.findOne(query, function (err, doc) {
                if (err) { throw err; }

                doc.tags = doc.tags.join().toString();
                res.render("post_edit", {"post" : doc,
                                         userinfo: req.userinfo});
            });
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

    /**
    * POST data for a post to create a post
    **/
    app.post("/post", function (req, res, next) {
        if (req.isAuthenticated()) {

            var post = new Post(),
                cleaned = [],
                tags_array = req.body.postTags.split(","),
                i;

            post.taskCode = req.body.taskCode;
            post.taskSubCode = req.body.taskSubCode;
            post.postText = req.body.postText;
            //post.tags = req.body.postTags;

            post.author = req.user._id;
            post.created = new Date();
            post.updated = new Date();


            for (i = 0; i < tags_array.length; i += 1) {
                if ((cleaned.indexOf(tags_array[i]) === -1) && tags_array[i] !== "") {
                    cleaned.push(tags_array[i].replace(/\s/g, ''));
                }
            }

            post.tags = cleaned;

            post.save(function (err, doc, noDocAffected) {
                if (err) {
                    throw err;
                }
                console.log("pending impl...");
                console.log("redirection pending");
            });
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

    app.post("/post/edit/:id", function (req, res, next) {
        if (req.isAuthenticated()) {
            var postTags = req.body.postTags,
                cleaned = [],
                tags_array,
                i,
                query,
                update;

            query = {_id: req.params.id, author: req.user._id};

            tags_array = postTags.split(",");

            for (i = 0; i < tags_array.length; i += 1) {
                if ((cleaned.indexOf(tags_array[i]) === -1) && tags_array[i] !== "") {
                    cleaned.push(tags_array[i].replace(/\s/g, ''));
                }
            }

            update = {
                "taskCode": req.body.taskCode,
                "taskSubCode": req.body.taskSubCode,
                "postText": req.body.postText,
                "tags": cleaned,
                "updated": new Date()
            };

            Post.update(query, update, function (err, docsAffected) {
                if (err) { throw err; }
                console.log("total docs updated: " + docsAffected);
                res.redirect("/posts");
            });
        } else {
            req.flash('info', 'Oops !! You need to login first to view this page.');
            res.redirect('/login');
        }
    });

    /**
    * DELETE a post from post list
    **/
    app.delete("/post/:id", function (req, res, next) {
        if (req.isAuthenticated()) {
            var query = {_id: req.params.id, author: req.user._id};
            Post.remove(query, function (err, docsDeleted) {
                if (err) { throw err; }
                console.log("AJAX request, so no redirection");
                console.log("total no. of docs deleted: " + docsDeleted);
            });
        } else {
            res.redirect('/login');
        }
    });

};
