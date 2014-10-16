var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
        email: {type: String}, //will be email
        firstName: {type: String},
        lastName: {type: String},
        gender: {type: String},
        country: {typ: String},
        password: {type: String}
    });

// generating hash
userSchema.methods.generateHash = function (password) {
    "use strict";
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password valid
userSchema.methods.validPassword = function (password) {
    "use strict";
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);
