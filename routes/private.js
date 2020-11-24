const express = require('express');
const router  = express.Router();

const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

const middlewares = require('./middlewares');

//routes 
router.get('/', middlewares.loginCheck, (req, res) => {
    res.render('private/mainpage')
})

router.get('/dashboard', middlewares.loginCheck, (req, res, next) => {
    // get all the sessions from the database
    HelpSession.find().populate('student')
    .populate('teacher')
    .then(sessions => {
      // render a books view to display them
      console.log(sessions)
      res.render('private/dashboard', { sessionList: sessions })
    }).catch(err => {
      console.log(err);
    })
  });

  router.get('/overview', middlewares.loginCheck, (req, res, next) => {
    // get all the sessions from the database
    HelpSession.find().populate('student')
    .populate('teacher')
    .then(sessions => {
      // render a books view to display them
      
      // sessions.sessionStartDate = 14/07/2020
      sessions.forEach( (sess)=>{
      sess.sessionStartDate = sess.sessionStartDate.getHours()
      })
      // sessions.sessionStartDate.getHours() + ":" + sessions.sessionStartDate.getMinutes() + ":" + sessions.sessionStartDate.getSeconds();
      // console.log(sessions)
      console.log(sessions[0].sessionStartDate)
      res.render('private/overview', { sessionList: sessions })
    }).catch(err => {
      console.log(err);
    })
  });

  router.get('/sessions', (req, res, next) => {
    // get all the sessions from the database
    HelpSession.find().populate('student')
    .populate('teacher')
    .then(sessions => {
      // render a books view to display them
      
      console.log(sessions)
      res.json( {sessions})
    }).catch(err => {
      console.log(err);
    })
  });

module.exports = router;