const mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
username: String,
email: String,
sessions: Array,
slackId: String,
googleId: String,
})


mongoose.model('User', UserSchema);