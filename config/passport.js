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

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {
            // asynchronous
            // User.findOne wont fire unless data sent back
            process.nextTick(function () {
                User.findOne({'email': email}, function (err, user) {
                    // if any error, return the error
                    if (err) { return done(err); }
                    // check if already a user with that email
                    if (user) {
                        return done(null, false, req.flash('info', 'This email is already taken.'));
                    }
                    var newUser = new User();
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;
                    newUser.gender = req.body.inputGender;
                    newUser.country = req.body.country;

                    newUser.save(function (err) {
                        if (err) { throw err; }
                        return done(null, newUser);
                    });
                });
            });
        }
        ));

    passport.use('local-login', new LocalStrategy({usernameField: 'email',
                                                   passwordField: 'password',
                                                   passReqToCallback: true },
    function (req, email, password, done) {
        User.findOne({'email': email}, function (err, user) {
            //console.log(user);
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('info', 'No user found'));
            }


            if (!user.validPassword(password)) {
                return done(null, false, req.flash('info', 'Oops !! Wrong password'));
            }
            return done(null, user);
        });
    }
    ));
};
