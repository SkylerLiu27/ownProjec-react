const jwt = require('jsonwebtoken');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/config.json');

// define the passport authentication strategy 
module.exports = new LocalStrategy({
    usernameField: 'email',  // req.body.email will be passed here
    passwordField: 'password', // req.body.password
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    const userData = {
        eamil: email.trim(),
        password: password
    };

    User.findOne({email: userData.eamil}, (err, user) => {
        // err happens
        if(err) { return done(err, false, {message: 'dataBase Error!'}, null); }
        // not found user, email not found
        if(!user) { return done(null, false, {message: 'incorrect email or password'}, null); }

        // found the user, compare the password with salt
        user.comparePassword(userData.password, (err, isMatched) => {
            
            if(err) { return done(err); }
            // password incorrect! 
            if(!isMatched) { 
                console.log('Sigin Password Incorrect!');
                return done(null, false, {message: 'incorrect email or password'}, null); 
            }
            
            console.log('Sigin Password correct!');
            console.log('Sigin Password correct!');
            // password matched
            // use jwt to sign a token
            const payload = {
              id: user._id // unique id of the document
            };
            
            jwt.sign(payload, config.jwtSecret, (err, token) => {
                // err when signing the token
                if(err) { return done(err); }
                // get token
                console.log("token: " + token);
                return done(null, true, {message: 'Login Success!', token: token});
            });
        });
    });
});