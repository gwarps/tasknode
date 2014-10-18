var ObjectID = require('mongodb').ObjectID;

var Post = require('../models/post');

module.exports = function (app) {
    "use strict";
    /**
    * GET all posts
    **/
    app.get("/posts", function (req, res, next) {
        if (req.isAuthenticated()) {
            Post.find({}, function (err, docs) {
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

            var query = {_id: req.params.id};

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

            post.author = new ObjectID(1);
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
                update;

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

            Post.findByIdAndUpdate(req.params.id, update, function (err, doc) {
                if (err) { throw err; }
                console.log(doc + "updated");
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
            Post.findByIdAndRemove(req.params.id, function (err) {
                if (err) { throw err; }
                console.log("redirection pending");
            });
        } else {
            res.redirect('/login');
        }
    });

};
