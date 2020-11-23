const express = require('express');
const router  = express.Router();

const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

const middlewares = require('./middlewares');

//routes 
router.get('/', middlewares.loginCheck, (req, res) => {
    res.render('private/mainpage')
})



module.exports = router;