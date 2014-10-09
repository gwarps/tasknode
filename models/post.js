var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var postSchema = new Schema({
   _id: ObjectId,
   taskCode: {type: String},
   taskSubCode: {type: String},
   postText: {type: String},
   tags: {type: []},
   author: {type: ObjectId},
   created: {type: Date},
   updated: {type: Date}
});

module.exports = mongoose.model('Post', postSchema);
