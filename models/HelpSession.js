const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const helpSessionSchema = new Schema({
    status: {
        type: String,
        required: true
    },
    type: {
      type: String, 
      required: true,
      enum: ['scheduledForNow','scheduledForLater']
    },
    Student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    //Teacher: if we want the teacher id here, we need it to be a different entity collection, no? 
    topic: String, //maybe here we should add a enum with the list of accepted values? or maybe we can handle this on slacks side
    SessionStartDate: Date,
    SessionEndDate: Date,
    userRating: Number,
    teacherRating: Number,
    images: Array,
    description: String,
    slackChannelId: String 
});

const HelpSession = mongoose.model('HelpSession', helpSessionSchema);

module.exports = HelpSession;