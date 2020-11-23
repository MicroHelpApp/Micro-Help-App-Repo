const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

//routes 
router.get('/', (req, res, next) => {
    //console.log('user was created')

    //the User.Create() and HelpSession.create() here are just for testing. Once auth is implemented this will change. 
    User.create({
        username: 'pedro1',
        type: 'student',
        date: Date.now(), 

    });
    HelpSession.create({
        status: 'pending',
        type: 'scheduledForNow',
    }) 
});

module.exports = router;