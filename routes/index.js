const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const HelpSession = require('../models/HelpSession');

//routes 
router.get('/', (req, res, next) => {
  res.render('index');
});

// the route to the dashboard view
router.get('/dashboard', (req, res, next) => {

    // get all the sessions from the database
    HelpSession.find().then(sessions => {
      // render a books view to display them
      console.log(sessions)
      res.render('dashboard', { chartData: sessions })
    }).catch(err => {
      console.log(err);
    })
  });


module.exports = router;


