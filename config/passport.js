var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

module.exports = function (passport) {
    "use strict";

    /**
    * required for persistent login sessions
    * ability to serialize and deserialize users in and out of session
    **/

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    /**
    * LOCAL SIGNUP
    * using named strategies
    * by default if there is no name, it will called "local"
    **/

    passport.local(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {
            // asynchronous
            // User.findOne wont fire unless data sent back
            process.nextTick(function () {
                User.findOne({'local.email': email}, function (err, user) {
                    // if any error, return the error
                    if (err) { return done(err); }
                    // check if already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signUpMessage', 'This email is already taken.'));
                    }
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function (err) {
                        if (err) { throw err; }
                        return done(null, newUser);
                    });
                });
            });
        }
        ));
};
