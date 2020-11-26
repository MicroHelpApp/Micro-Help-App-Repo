const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const HelpSession = require('../models/HelpSession');
const middlewares = require('./middlewares');

//routes 
router.get('/', (req, res, next) => {
  console.log(req.user)
  
  res.render('index', {
    user: req.user
  });
  
});



module.exports = router;


