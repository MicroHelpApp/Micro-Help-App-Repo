const express = require('express');



const loginCheck = () => {
    return (req, res, next) => {
      console.log(req.user)
      // if the user is logged in we proceed as intended (call next())
      if (req.user) {
        next();
      } else {
        // if user is not logged in we redirect to login
        res.redirect('/auth/login');
      }
    }
}

// const navBarBuilder = () => {
//   return (req, res, next) => {
//     res.send({user: req.user}).next()
//     next()
//     // if the user is logged in we display logout, overview, analytics in the nav bar 
//     // if user is not logged in we display home, signup and login in the nav bar 
//   }
// }

module.exports = {
    loginCheck: loginCheck(),
    //navBarBuilder: navBarBuilder()
}
 
