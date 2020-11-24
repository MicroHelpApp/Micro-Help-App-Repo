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
      // if the session is open, close it
      if (data.status == 'Open'){
        HelpSession.findByIdAndUpdate(id, {status: 'Closed', sessionEndDate: new Date()} )
        .then(res => console.log(res))
        .then(() => {
          HelpSession.find().populate('student')
            .populate('teacher')
            .then(sessions => {
          //     console.log(sessions)
              res.render('private/overview', { sessionList: sessions })
        })})
      }
       else {
          HelpSession.find().populate('student')
            .populate('teacher')
            .then(sessions => {
          //     console.log(sessions)
              res.render('private/overview', { sessionList: sessions })
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
  })


module.exports = router;