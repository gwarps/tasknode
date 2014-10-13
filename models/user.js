var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
        userName: {type: String}, //will be email
        firstName: {type: String},
        lastName: {type: String},
        gender: {type: String},
        country: {typ: String},
        password: {type: String}
    });

module.exports = mongoose.model('User', userSchema);
