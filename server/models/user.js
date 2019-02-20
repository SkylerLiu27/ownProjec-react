const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // generate salt

// define the schema of the user
var Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        index: {unique: true} // avoid same user
    },
    password: String
});

// Add instance method to documents from Models compiled from this Schema
UserSchema.method('comparePassword', function (password, callback){
        // password: passed by client
        // this.password: hashed password after adding salt
        // async compare, result in the callback 
        bcrypt.compare(password, this.password, callback);
    })


// pre hook for the document, it is a middleware of Document.save()
// when excuting Document.save(), the following middleware will 
// replace the plain password with the hashed password.
UserSchema.pre('save', function(next){
    const user = this;
    bcrypt.genSalt((err, salt) => {
        // genSalt error
        if(err) { next(err); }
        bcrypt.hash(user.password, salt, (err, hash) => {
            // hash error
            if(err) { next(err); }
            user.password = hash;
            console.log('User: ' + user.email);
            console.log('Hashed password after genSalt: ' + hash);
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);