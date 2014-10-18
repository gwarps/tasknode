var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
        taskCode: {type: String},
        taskSubCode: {type: String},
        taskDesc: {type: String},
        created: {type: Date},
        updated: {type: Date},
        author: {type: ObjectId}
    });

module.exports = mongoose.model('Task', taskSchema);
