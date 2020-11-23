const express = require('express');
const router  = express.Router();

//routes 
router.get('/', (req, res, next) => {
  res.render('index');
});

// the route to the dashboard view
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

module.exports = router;
