const express = require('express');



const loginCheck = () => {
    return (req, res, next) => {
      // if the user is logged in we proceed as intended (call next())
      if (req.user) {
        next();
      } else {
        // if user is not logged in we redirect to login
        res.redirect('/auth/login');
      }
    }
}

module.exports = {
    loginCheck: loginCheck()
}
 
