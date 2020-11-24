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
            userRating_text: userRating
        }
    ).then( data => {
        Axios
        .post( replyUrl, 	  
        {
            replace_original: "true",
            text: `glugluglu`,
        })	
    }) 
    res.sendStatus(200)
})



module.exports = router;