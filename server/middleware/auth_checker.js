const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const User = require('../models/user');

module.exports = (req, res, next) => {
    //console.log('auth_checker: ' + req.headers);
    if(!req.headers.authorization){
        return res.status(401).end();
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log("TOKEN: " + token);
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if(err) { return res.status(401).end(); }
        // successfully decoded token! correct token
        if(decoded){
            //console.log('successfully decoded token! correct token');
            const id = decoded.id;
            //console.log('id: ' + id);
            User.findById(id, (err, user) => {
                if(err || !user) { return res.status(401).end(); }
                return next();
            });
        } else{ // decoded === 'undefined'
            // token incorrect
            console.log('token incorrect not decoded! ');
            return res.status(401).end();
        }

    });
};
