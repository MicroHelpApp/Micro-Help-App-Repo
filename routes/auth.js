const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');

const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

//routes 

router.get('/signup', (req, res, next) => {
   res.render('auth/signup')
});

router.get('/login', (req, res, next) => {
    res.render('auth/login')
 });

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    passReqToCallback: true
})
);

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 8) {
      res.render('auth/signup', {
        message: 'Your password must be 8 characters minimun.'
      });
      return;
    }
    else if (username === '') {
      res.render('auth/signup', { message: 'Your username cannot be empty' });
      return;
    }
    else {
        User.findOne({ username: username }).then(found => {
            if (found !== null) {
              res.render('auth/signup', { message: 'This username is already taken' });
            } else {
              // we can create a user with the username and password pair
              const salt = bcrypt.genSaltSync();
              const hash = bcrypt.hashSync(password, salt);
        
              User.create({ username: username, password: hash })
                .then(dbUser => {
                  // login with passport 
                  req.login(dbUser, err => {
                    if (err) {
                      next(err);
                    } else {
                      res.redirect('/');
                    }
                  })
                })
                .catch(err => {
                  next(err);
                });
            }
          });
    }
  });



module.exports = router;