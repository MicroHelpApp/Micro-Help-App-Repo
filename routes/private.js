const express = require('express');
const router  = express.Router();

const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

const middlewares = require('./middlewares');

const schedule = require('./schedule')

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
      // // sessions.sessionStartDate = 14/07/2020
      // sessions.forEach( (sess)=>{
      //   console.log(sess);
      //   sess.description = sess.sessionStartDate.toString().split(' ')[4]
      // // sess[hours] = sess.sessionStartDate.toString().split(' ')[4]
      // // sess.sessionStartDate = sess.sessionStartDate
      // })
      // // sessions.sessionStartDate.getHours() + ":" + sessions.sessionStartDate.getMinutes() + ":" + sessions.sessionStartDate.getSeconds();
      // // console.log(sessions)
      // // console.log(sessions)
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

  router.get('/close/:id', middlewares.loginCheck, (req, res, next) => {
    // console.log(req.params.id)
//Bring me the information on the clicked button
    let id = req.params.id
    HelpSession.findById(id)
    .then(data => {
      let helpSessionObj = data
      
      // if the session is open, close it
      if (data.status == 'open'){ 
        HelpSession.findByIdAndUpdate(data._id, {status: 'done', sessionEndDate: Date.now()} ) 
        .then(data => {
          schedule.sendRatingMessage(helpSessionObj)    
          res.redirect('/private/overview')
        })
      }
       else {
        res.redirect('/private/overview')
      }
    })
    .catch(err => {
      console.log(err);
    })
  })


module.exports = router;

