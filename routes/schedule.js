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


//functions
const okMessage = (username, channelId) => { //this is no longer being used. 
    Slack.chat.postMessage({
      token: token, 
      channel: channelId,
      text: `the user name is ${username}`
    })
    .then( data => console.log(`okMessage() called and sent`))
    .catch( err => console.log(err))
}

const newRatingBlock = (helpSession) => {

  return [
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*Type:*\n${helpSession.type}`
          },
          {
            "type": "mrkdwn",
            "text": `*Date Created:*\n${helpSession.sessionStartDate}`
          },
          {
            "type": "mrkdwn",
            "text": `*Date Completed:*\n${helpSession.sessionEndDate}`
          },
          {
            "type": "mrkdwn",
            "text": `*Status:*\n${helpSession.status}` 
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
              "text": "Very good! 5️⃣"
            },
            "style": "primary",
            "value": "5"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "good 4️⃣"
            },
            "style": "primary",
            "value": "4"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "meh... 3️⃣"
            },
            "value": "3"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "bad 2️⃣"
            },
            "style": "danger",
            "value": "2"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Very bad! 1️⃣"
            },
            "style": "danger",
            "value": "1"
          }
        ]
      }
    ]
}

const createUserFromSlack = (slackUserId) => {

  return Slack.users.info({
    token: token,
    user: slackUserId
  })
  .then(data => {
    return User.create({
      username: data.user.name, 
      slackUserId: slackUserId, 
      type: 'student',
      slackUserRealName: data.user.real_name 
    })
  })
  .catch(err => console.log(err))

  
}

const createHelpSession = (user, channelId) => {
  console.log(user)
  return HelpSession.create({
    status: 'Open',
    type: 'scheduledForNow',
    student: user._id || user[0]._id,
    sessionStartDate: new Date(),
    sessStartStr: new Date().toString().slice(0,21),
    slackChannelId: channelId,
    studentSlackId: user.slackUserId || user[0].slackUserId,
    slackUserRealName: user.slackUserRealName || user[0].slackUserRealName
  })
  .then(data => {
    //okMessage(user.username || user[0].username, channelId) This has been substituted by the below implementation
    HelpSession.find({
      status: 'Open'
    })
    .then(arr => {
      console.log(arr)
      return buildScheduleListForSlack(user, arr)
    }).then(str => {
      console.log(str)
      Slack.chat.postMessage({
        token: token, 
        channel: channelId, // slackChannelId
        text: str
      })
      .then( payload => {
        console.log('str was sent')
      })
      .catch( err => console.log(err))
    })

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

const sendUserDirectMessage = (helpSession) => { //fist we must open a conversation
  Slack.conversations.open({
    token: token, 
    users: helpSession.studentSlackId,
  })
  .then( payload => {
    sendRatingMessage(payload, helpSession)
  })
  .catch( err => console.log(err))
}

const sendRatingMessage = (payload, helpSession) => { //then we can send the message 
  
  HelpSession.findById(helpSession._id)
  .then( helpSessionFound => {
    Slack.chat.postMessage({
      token: token, 
      channel: payload.channel.id, 
      text: 'Rate your last help session!',
      blocks: newRatingBlock(helpSessionFound)
    })
    .then( data => {
      updateSlackTs(helpSession._id, data) 
    })
    .catch( err => console.log(err))

  })
  .catch( err => console.log(err))
  
}

const buildScheduleListForSlack = (user, arr) => {
  let str = `*Hey ${user.username || user[0].username}, your help session in on its way! 🧠 *\n\nThe current waiting list is:\n`;

  for (let i = 0; i < arr.length; i++) {
    str += `\n ${i+1}. ${arr[i].slackUserRealName}`
  }
  return str
}
  

//routes 
router.get('/', (req, res, next) => {
  console.log('SCHEDULE IS TRIGGERED')
});

router.post('/', (req, res, next) => {

  //console.log(req.body)

  User.find({slackUserId: req.body.user_id})
  .then( data => {
    if (data.length !== 0) {
      
      createHelpSession(data, req.body.channel_id)
    } else {
      createUserFromSlack(req.body.user_id)
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
      text: buildScheduleListForSlack()
    })
    .then( payload => {
      res.redirect('/')
    })
    .catch( err => console.log(err))


  
  // Slack.chat.postMessage({
  //   token: token, 
  //   channel: 'C01EQM56FQF', // slackChannelId
  //   text: 'test text',
  //   blocks: ratingBlock()
  // })
  // .then( payload => {
  //   updateSlackTs('5fbe1820fa3495eb42f74678', payload) // slackMessage_Ts 
  //   res.redirect('/')
  // })
  // .catch( err => console.log(err))
});

module.exports = router;

module.exports.sendRatingMessage = sendRatingMessage;

module.exports.sendUserDirectMessage = sendUserDirectMessage;