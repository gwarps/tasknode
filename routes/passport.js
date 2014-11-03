module.exports = function (app, passport) {
    "use strict";

    app.get('/login', function (req, res) {
        if (req.isAuthenticated()) {
            req.flash('info', 'You are already authenticated. Please logout first to login.');
            res.redirect('/');
        } else {
            res.render('login', { userinfo: req.userinfo,
                                  message: req.flash('info') });
        }
    });

    app.post('/login', passport.authenticate('local-login', { successRedirect: '/',
                                                              failureRedirect: '/login',
                                                              failureFlash: true})
        );

    app.get('/signup', function (req, res) {
        if (req.isAuthenticated()) {
            req.flash('info', 'Please logout first for creating a new account.');
            res.redirect('/');
        } else {
            res.render('signup', { message: req.flash('Welcome to tasknode signup'),
                                   userinfo: req.userinfo });
        }
    });

    app.post('/signup',
        passport.authenticate('signup', { successRedirect: '/',
                                                failureRedirect: '/signup',
                                                failureFlash: true})
        );

    app.get('/logout', function (req, res) {
        if (req.isAuthenticated()) {
            req.logout();
            req.flash('info', 'Logged out successfully.');
            res.redirect('/');
        } else {
            req.flash('info', 'Oops !! Seems like you never logged in.');
            res.redirect('/');
        }
    });

    /**
    * Utility function for authentication check
    **/
    //function isAuthenticated(req, res, next) {
    //    if (req.user.isAuthenticated) {
    //        return next();
    //    }
    //}
};
