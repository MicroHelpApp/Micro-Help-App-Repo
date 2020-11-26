const express = require('express');
const router  = express.Router();

const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

const middlewares = require('./middlewares');

const schedule = require('./schedule');
const { Session } = require('express-session');

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
    HelpSession.find({status: "Open"}).sort( { sessionStartDate : -1} )

    .populate('student')
    .populate('teacher')
    .then((openSessions)=>{
      HelpSession.find({status: "Done"}).sort( { sessionEndDate : -1} )
      .limit(10)
      .populate('student')
      .populate('teacher')
      .then(closedSessions => {
        User.find({type: 'teacherAssistant'})
        .then( teachers => {
          // console.log(teachers[0].username)
          res.render('private/overview', { sessionList: openSessions, closedSessions, teachers })
        })
    })
    }).catch(err => {
      console.log(err);
    })
  });

  router.get('/sessions', (req, res, next) => {
    // get all the sessions from the database
    HelpSession.find().populate('student')
    .populate('teacher')
    .then(sessions => { 
      console.log(sessions)
      res.json( {sessions})
    }).catch(err => {
      console.log(err);
    })
  });

  router.get('/doneSessions', (req, res, next) => {
    // get all the sessions from the database
    HelpSession.find({status: 'Done'}).populate('student')
    .populate('teacher')
    .then(sessions => {
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
      if (data.status == 'Open'){ 
        HelpSession.findByIdAndUpdate(data._id, {status: 'Done', sessionEndDate: new Date() , sessEndStr: new Date().toString().slice(0,21), sessionDuration: Math.ceil(Math.abs( new Date() - data.sessionStartDate) / (1000 * 60 * 60))} ) 
        .then(data => {
          schedule.sendUserDirectMessage(helpSessionObj)    
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

  router.post('/assign:id', middlewares.loginCheck, (req, res, next) => {
    console.log(req.body)
    console.log(req.params)
    HelpSession.findByIdAndUpdate(req.params.id, {teacher: req.body.q})
    .then( ()=> {
      res.redirect('/private/overview')
    })
  })



module.exports = router;

