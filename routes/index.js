const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const HelpSession = require('../models/HelpSession');

//routes 
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;
