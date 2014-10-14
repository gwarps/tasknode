module.exports = exports = function (app) {
    "use strict";
    require("./tasks")(app);
    require("./posts")(app);

    app.get("/", function (req, res) {
      //var er = req.flash("error", "it worked");
      //res.redirect('docs', {"message" : er});
        res.render('index', { message : req.flash('info') });
    });

    app.get("/docs", function (req, res) {
        res.render('docs');
    });

    app.get('/flash', function (req, res) {
        req.flash('info', 'Hi There');
        res.redirect('/');
    });
};
