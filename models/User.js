const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    slackUserId: String, 
    googleId: String,
    linkedInId: String,
    githubId: String,
    FacebookId: String, 
    type: {
        type: String,
        enum: ['student', 'teacherAssistant', 'leadTeacher'],
    },
    dateCreated: {
        type: Date,
        default: Date.now //here maybe we should define the timezone 
    },
    LastScheduledSession: Date,
    numberOfSessions: Number,
    avgRating: Number, // not sure we should use that. Maybe inside the session we could have the TA rating and the Stident rating
    country: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;



