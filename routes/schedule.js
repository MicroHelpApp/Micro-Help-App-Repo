const express = require('express');
const router  = express.Router();
const Axios = require('axios');

const sendMessageSlackWebhook = process.env.SLACK_MESSAGE_WEBHOOK;

// npm slack setup
const token = process.env.SLACK_BOT_TOKEN;
const Slack = require('slack');
const User = require('../models/User');
const HelpSession = require('../models/HelpSession');
const bot = new Slack({token});

//functions
const okMessage = (username, channelId) => {
    Axios
      .post( sendMessageSlackWebhook, 
      {text: `Hey ${username}, your session has been scheduled! the channel Id is ${channelId} 🧠`,
    })
    .then(data => console.log('message sent'))
    .catch(err => console.log(err))

    // Slack.chat.postMessage({
    //   token: token, 
    //   channel: "C01EQM56FQF",
    //   text: "test text"
    // })
    // .then( data => console.log(data))
    // .catch( err => console.log(err))
}

const block1 = (content) => {
  return {
    "blocks": [
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Type:*\nASAP"
          },
          {
            "type": "mrkdwn",
            "text": "*When:*\nSubmitted Mar 10, 2020 10:23"
          },
          {
            "type": "mrkdwn",
            "text": "*Last Update:*\nMar 10, 2020 10:45"
          },
          {
            "type": "mrkdwn",
            "text": "*Topic:*\nlab-spotify."
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*How was your session with the TA?*\nselect one of the below options to rate the session :) "
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Very good!"
            },
            "style": "primary",
            "value": "very_good"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "good"
            },
            "style": "primary",
            "value": "good"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "meh..."
            },
            "value": "meh"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "bad"
            },
            "value": "bad"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Very bad! "
            },
            "style": "danger",
            "value": "very_bad"
          }
        ]
      }
    ]
  }
}

//routes 
router.get('/', (req, res, next) => {
  console.log('SCHEDULE IS TRIGGERED')
});

router.post('/', (req, res, next) => {

  User.find({slackUserId: req.body.user_id})
  .then( data => {
    if (data.length !== 0) {
      console.log(data)
    } else {
      User.create({
        username: req.body.user_name, 
        slackUserId: req.body.user_id, 
        type: 'student',
      })
      .then(data => {
        HelpSession.create({
          status: 'open',
          type: 'scheduledForNow',
          student: data._id,
          // teacher: {
          //     type: Schema.Types.ObjectId,
          //     ref: 'User',
          // }, //if we want the teacher id here, we need it to be a different entity collection, no? 
          // topic: String, //maybe here we should add a enum with the list of accepted values? or maybe we can handle this on slacks side
          sessionStartDate: Date.now(),
          // sessionEndDate: Date,
          // userRating: Number,
          // teacherRating: Number,
          // images: Array,
          // description: String,
          slackChannelId: req.body.channel_id
        })
        .then(data => {
          okMessage(req.body.user_name, data.slackChannelId)
        })
        .catch(err => console.log(err))
      })
    }
  })
  .catch(err => console.log(err))


    
  res.sendStatus(200)

  });

// This is a form added just so we can trigger a slack message from the web. it is optional.
router.post('/sendText', (req, res, next) => {
    Axios
    .post(sendMessageSlackWebhook, 

      block1(req.body.content)

    //{text: `${req.body.content}`}
    
    )
  .then( data => {
    console.log(data, 'it worked'),
    res.redirect('/')
  })
  .catch( err => console.log(err))
});





module.exports = router;