// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var option = new Schema({ description: String, votes: Number });

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Poll', new Schema({
    owner: { type: ObjectId, ref: 'User' },
    question: String,
    options: [option]
}));