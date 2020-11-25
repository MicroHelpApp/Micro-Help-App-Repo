const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const helpSessionSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['Open', 'Done']
    },
    type: {
      type: String, 
      required: true,
      enum: ['scheduledForNow','scheduledForLater']
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    studentSlackId: String,
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }, //if we want the teacher id here, we need it to be a different entity collection, no? 
    topic: String, //maybe here we should add a enum with the list of accepted values? or maybe we can handle this on slacks side
    sessionStartDate: Date,
    sessStartStr: String,
    sessionEndDate: Date,
    sessEndStr: String,
    sessionDuration: Number,
    userRating: Number,
    teacherRating: Number,
    images: Array,
    description: String,
    slackChannelId: String,
    slackMessage_Ts: String,
    userRating_text: String, //this can be removed 
    slackUserRealName: String
});

const HelpSession = mongoose.model('HelpSession', helpSessionSchema);

module.exports = HelpSession;