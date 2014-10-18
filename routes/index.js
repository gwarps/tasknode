module.exports = exports = function (app, passport) {
    "use strict";
    //require("./passport")(app, passport);
    //require("./tasks")(app);
    //require("./posts")(app);


    app.use(function (req, res, next) {
        //console.log(req.user);
        req.userinfo = {};
        if (req.user === undefined) {
            req.userinfo.isPresent = false;
        } else {
            req.userinfo.isPresent = true;
            req.userinfo.email = req.user.email;
        }
        next();
    });

    require("./passport")(app, passport);
    require("./tasks")(app, passport);
    require("./posts")(app);


    app.get("/", function (req, res) {
      //var er = req.flash("error", "it worked");
      //res.redirect('docs', {"message" : er});
        res.render('index', { message : req.flash('info'),
                              userinfo: req.userinfo });
    });

    app.get("/docs", function (req, res) {
        res.render('docs', {userinfo: req.userinfo});
    });

    app.get('/flash', function (req, res) {
        req.flash('info', 'Hi There');
        res.redirect('/');
    });
};
