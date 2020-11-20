const express = require('express');
const router  = express.Router();
const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
  //res.render('index');
    console.log('user was created')
    User.create({
        username: 'pedro'
    }) 
});

module.exports = router;