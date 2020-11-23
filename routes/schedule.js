const express = require('express');
const router  = express.Router();
const Axios = require('axios');

const sendMessageSlackWebhook = 'https://hooks.slack.com/services/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';

//functions
const okMessage = (obj) => {
    console.log(obj)
    Axios
      .post( sendMessageSlackWebhook, 
      {text: `Hey ${obj.user_name}, your session has been scheduled! This message was sent from the real project 🧠`,
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

//routes 
router.get('/', (req, res, next) => {
  console.log('SCHEDULE IS TRIGGERED')
});

router.post('/', (req, res, next) => {
    res.sendStatus(200)
    okMessage(req.body)
  });

// This is a form added just so we can trigger a slack message from the web. it is optional.
router.post('/sendText', (req, res, next) => {
    Axios
    .post(sendMessageSlackWebhook, 
    {text: `${req.body.content}`,
  })
  .then( data => {
    console.log(data, 'it worked'),
    res.redirect('/')
  })
  .catch( err => console.log(err))
});

module.exports = router;