const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport');

const User = require('../models/User');
const HelpSession = require('../models/HelpSession')

const middlewares = require('./middlewares');
const { loginCkeck } = require('./middlewares');


//routes 

router.get('/signup', (req, res, next) => {
   res.render('auth/signup', {
     user: req.user
   })
});

router.get('/login', (req, res, next) => {
    res.render('auth/login', {
      user: req.user
    })
 });


router.post('/login', passport.authenticate('local', {
    successRedirect: '/private/overview',
    failureRedirect: '/auth/login',
    passReqToCallback: true
})
);

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 8) {
      res.render('auth/signup', {
        message: 'Your password must be 8 characters minimun.',
        user: req.user
      });
      return;
    }
    else if (username === '') {
      res.render('auth/signup', { 
        message: 'Your username cannot be empty',
        user: req.user, 
      });
      return;
    }
    else {
        User.findOne({ username: username }).then(found => {
            if (found !== null) {
              res.render('auth/signup', { 
                message: 'This username is already taken',
                user: req.user 
              });
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
                      res.redirect('/private/overview');
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

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
        successRedirect: '/private/overview',
        failureRedirect: '/'
    })
);

  router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.redirect('/auth/login')
      }
    })
  });



module.exports = router;