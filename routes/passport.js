module.exports = function (app, passport) {
    "use strict";
    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/signup', function (req, res) {
        res.render('signup');
    });
};
