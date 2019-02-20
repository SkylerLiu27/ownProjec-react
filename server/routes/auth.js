/**
 * Handle /auth request
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('validator');

router.post('/signup', (req, res, next) => {
    // validate the form
    const validationResult = validateSignUpForm(req.body);
    // submitted form is illegal
    if(!validationResult.success){
        console.log('submitted form is illegal!');
        return res.status(401).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    //using passport.authenticate() middleware
    passport.authenticate('local-signup', (err) => {
        if(err){
            console.log(err);
            if(err.code === 11000){
                // 11000 is the duplication email error
                // res.status(409) is conflict error
                return res.status(409).json({
                    success: false,
                    message: '',
                    errors: {
                        email: 'This email has been taken.'
                    }
                    });
            }
            //other err
            return res.status(400).json({
                    success: false,
                    message: 'Could not process the form.'
                });
        }

        return res.status(200).json({
                success: true,
                message: "Successfully sign up! Now you should be able to sign in!"
            });

    })(req, res, next);

});


router.post('/login', (req, res, next) => {
    const validationResult = validateSignInForm(req.body);
    if(!validationResult.success){
        console.log('Submitted form is illegal!');
        return res.status(400).json({
                success: false,
                message: validationResult.message,
                errors: validationResult.errors
            });
    }

    passport.authenticate('local-login', (err, isPassed, option) => {
        // err 
        if(err){
            console.log(err);
            return res.status(400).json({
                    success: false,
                    message: err.message,
                });
        }

        if(!isPassed){
            return res.status(400).json({
                    success: false,
                    message: option.message
                });
        }

        if(isPassed){
            // OK
            console.log("token: " + option.token);
            return res.status(200).json({
                    success: true,
                    message: option.message,
                    token: option.token
                });
        }

    })(req,res, next);

});


function validateSignUpForm(payload){
    //log
    console.log(payload);
    var isFormValid = true;
    var errors = {}; // 
    var message = '';

    if(!payload){
        isFormValid = false;
        message = 'please provide email and password';
    }

    // check email
    if(typeof payload.email !== 'string' || !validator.isEmail(payload.email)){
        isFormValid = false;
        errors.email = 'Please provide legal email address.'
    }

    if(typeof payload.password !== 'string' || payload.password.length < 8){
        isFormValid = false;
        errors.password = 'Password should be >8 characters.'
    }

    return {
        success: isFormValid,
        message: message,
        errors: errors
    };
}

function validateSignInForm(payload){
    //log
    console.log(payload);
    var isFormValid = true;
    var errors = {};
    var message = '';

    if(!payload){
        isFormValid = false;
        message = 'please provide email and password';
    }
    // validate email
    if(typeof payload.email !== 'string' || !validator.isEmail(payload.email)){
        isFormValid = false;
        errors.email = 'Please provide legal email address';
    }

    if(typeof payload.password !== 'string' || payload.password.length === 0){
        isFormValid = false;
        errors.password = 'Please provide legal password.'
    }

    return {
        success: isFormValid,
        message: message,
        errors: errors
    };
    
}

module.exports = router;