const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    slackUserId: String, 
    googleId: String,
    linkedInId: String,
    githubId: String,
    facebookId: String, 
    type: {
        type: String,
        enum: ['student', 'teacherAssistant', 'leadTeacher'],
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastScheduledSession: Date,
    numberOfSessions: Number,
    avgRating: Number, 
    country: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;



