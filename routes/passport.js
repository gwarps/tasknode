module.exports = function (app, passport) {
    "use strict";
    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/login', passport.authenticate('local-login', { successRedirect: '/',
                                                              failureRedirect: '/login',
                                                              failureFlash: true})
        );

    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('Welcome to tasknode signup'),
                               userinfo: req.userinfo });
    });

    app.post('/signup',
        passport.authenticate('signup', { successRedirect: '/',
                                                failureRedirect: '/signup',
                                                failureFlash: true})
        );
};
