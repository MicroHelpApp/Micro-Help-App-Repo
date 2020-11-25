const express = require('express');
const router  = express.Router();
const Axios = require('axios');

// npm slack setup
const token = process.env.SLACK_BOT_TOKEN;
const Slack = require('slack');
const User = require('../models/User');
const HelpSession = require('../models/HelpSession');
const bot = new Slack({token});

//functions

const updateRatingBlock = (helpSession) => {
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
            "text": "*Thank you for rating this session 💙*\nYour rating will help the teaching team to provide you a better experience :) "
          }
        }
      ]
}



//routes 

//http://microhelp.ngrok.io/interactivity


router.get('/', (req, res) => {
    console.dir(req.body)
})

router.post('/', (req, res) => {

    const obj = JSON.parse(req.body.payload)
    console.log(obj)
    
    const replyUrl = obj.response_url
    
    const userRating = obj.actions[0].value
    
    const ts = obj.container.message_ts

    HelpSession
    .findOneAndUpdate(
        {slackMessage_Ts: ts},
        {
            userRating: Number(userRating)
        }
    ).then( helpSessionFound => {
        //console.log(`the received data is ${helpSessionFound}`)
        Axios
        .post( replyUrl, 	  
        {
            replace_original: "true",
            blocks: updateRatingBlock(helpSessionFound),
        })	
    }) 
    res.sendStatus(200)
})



module.exports = router;

