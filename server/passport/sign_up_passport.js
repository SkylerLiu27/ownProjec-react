const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    const userData = {
        email: email.trim(),
        password: password
    };

    const newUser = new User(userData);
    newUser.save((err) => {
        // err
        if(err) { return done(err); }
        console.log('Save new user success!');
        return done(null, newUser);
    });
   
});