var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
   _id: ObjectId,
   taskCode: {type: String},
   taskSubCode: {type: String},
   taskDesc: {type: String},
   created: {type: Date},
   updated: {type: Date}
});

module.exports = mongoose.model('Task', taskSchema);
