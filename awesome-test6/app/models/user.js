// grab the packages that we need for the user model
var mongoose   = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema     = mongoose.Schema;
var bcrypt     = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
    name: String,
    username: {type: String, unique: true, required: [true, "cannot be empty."], lowercase: true, index: true},
    password: { type: String, required: true, select: false }
});

UserSchema.plugin(uniqueValidator, {message: "is already taken."});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
    var user = this;

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    // console.log("password:"+password);
    // console.log("user.password:"+user.password);
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);