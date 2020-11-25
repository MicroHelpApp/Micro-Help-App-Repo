const express = require('express');
const router  = express.Router();
const Axios = require('axios');

// npm slack setup
const token = process.env.SLACK_BOT_TOKEN;
const Slack = require('slack');
const User = require('../models/User');
const HelpSession = require('../models/HelpSession');
const bot = new Slack({token});

//variables
const sendMessageSlackWebhook = process.env.SLACK_MESSAGE_WEBHOOK

const ratingMessage = {
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


//functions
const okMessage = (username, channelId) => {
    Slack.chat.postMessage({
      token: token, 
      channel: channelId,
      text: `the user name is ${username}`
    })
    .then( data => console.log(`message sent`))
    .catch( err => console.log(err))
}

const ratingBlock = () => {

  return [
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


const createUserFromSlack = (name, slackUserId) => {
  return User.create({
    username: name, 
    slackUserId: slackUserId, 
    type: 'student',
  })
}

const createHelpSession = (user, channelId) => {
  //console.log(user)
  //console.log(user)
  //console.log(user[0]._id)
  return HelpSession.create({
    status: 'open',
    type: 'scheduledForNow',
    student: user._id || user[0]._id,
    sessionStartDate: Date.now(),
    slackChannelId: channelId,
    studentSlackId: user.slackUserId || user[0].slackUserId
  })
  .then(data => {
    okMessage(user.username || user[0].username, channelId)
  })
  .catch(err => console.log(err))
}

const updateSlackTs = (helpSessionId, payload) => {

  HelpSession
  .findByIdAndUpdate(
    helpSessionId, 
    {
      slackMessage_Ts: payload.ts
  })
  .then(data => {
    console.log(data)
  }) 
  .catch(err => console.log(err))
}

const sendUserDirectMessage = (helpSession) => {
  Slack.conversations.open({
    token: token, 
    users: helpSession.studentSlackId,
    text: 'this is a message from the bot'
  })
  .then( payload => {
    sendRatingMessage(payload, helpSession)
  })
  .catch( err => console.log(err))
}

const sendRatingMessage = (payload, helpSession) => {
  Slack.chat.postMessage({
    token: token, 
    channel: payload.channel.id, 
    text: 'test text',
    blocks: ratingBlock()
  })
  .then( data => {
    updateSlackTs(helpSession._id, data) 
  })
  .catch( err => console.log(err))
}

//routes 
router.get('/', (req, res, next) => {
  console.log('SCHEDULE IS TRIGGERED')
});

router.post('/', (req, res, next) => {

  User.find({slackUserId: req.body.user_id})
  .then( data => {
    if (data.length !== 0) {
      
      createHelpSession(data, req.body.channel_id)
    } else {
      createUserFromSlack(req.body.user_name, req.body.user_id)
      .then(data => { 
        createHelpSession(data, req.body.channel_id)
      })
    }
  })
  .catch(err => console.log(err))
  res.sendStatus(200)
  });


// This is a form added just so we can trigger a slack message from the web. it is optional.
router.post('/sendText', (req, res, next) => {
  Slack.chat.postMessage({
    token: token, 
    channel: 'C01EQM56FQF', // slackChannelId
    text: 'test text',
    blocks: ratingBlock()
  })
  .then( payload => {
    updateSlackTs('5fbe1820fa3495eb42f74678', payload) // slackMessage_Ts 
    res.redirect('/')
  })
  .catch( err => console.log(err))
});

module.exports = router;

module.exports.sendRatingMessage = sendRatingMessage;

module.exports.sendUserDirectMessage = sendUserDirectMessage;