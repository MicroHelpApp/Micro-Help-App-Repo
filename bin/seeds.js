const mongoose = require('mongoose');

const HelpSession = require('../models/HelpSession');
const User = require('../models/User');

mongoose.connect('mongodb://localhost/micro-help-app-repo',{
  useNewUrlParser: true
});

const now = new Date()

const seedSessions = [
    {status: "Open",
    type: 'scheduledForNow',
    student: '5fbbb3976b59fbd5ce2ef85f',
    teacher: '5fbbb3976b59fbd5ce2ef861',
    topic: "CSS",
    sessionStartDate: new Date(),
    sessStartStr: new Date().toString().slice(0,21),
    sessionEndDate: '',
    userRating: 6,
    teacherRating: 7,
    images: [],
    description: "Trouble with css flex-box",
    slackChannelId: 'C01EQM56FQF'
  },
  {status: "Open",
  type: 'scheduledForNow',
  student: '5fbbb3f4024e40d61664c8ea',
  topic: "JS Arrays",
  teacher: '5fbbb3976b59fbd5ce2ef861',
  sessionStartDate: new Date(),
  sessStartStr: new Date().toString().slice(0,21),
  sessionEndDate: '',
  userRating: 8,
  teacherRating: 5,
  images: [],
  description: "Trouble with for each",
  slackChannelId: 'C01EQM56FQF'
},
{status: "Done",
type: 'scheduledForNow',
student: '5fbbb3f4024e40d61664c8eb',
teacher: '5fbbb3976b59fbd5ce2ef861',
topic: "JS Objects",
sessionStartDate: new Date(),
sessStartStr: new Date().toString().slice(0,21),
sessionEndDate: '',
userRating: 5,
teacherRating: 5,
images: [],
description: "Trouble with inheritances",
slackChannelId: 'C01EQM56FQF'
}
]

const seedUsers = [
    {username: "",
    password: '',
    slackUserId: 'U01F2AHPKTP',
    googleId: '',
    linkedInId: '',
    githubId: '',
    facebookId: '',
    type: 'student',
    dateCreated: new Date(),
    lastScheduledSession: '',
    numberOfSessions: 1,
    avgRating: 5,
    country: 'Berlin'
},
{username: "",
password: '',
slackUserId: 'U01F2AHPKTP',
googleId: '',
linkedInId: '',
githubId: '',
facebookId: '',
type: 'student',
dateCreated: new Date(),
lastScheduledSession: '',
numberOfSessions: 5,
avgRating: 5,
country: 'Berlin'
},
{username: "",
password: '',
slackUserId: 'U01F2AHPKTP',
googleId: '',
linkedInId: '',
githubId: '',
facebookId: '',
type: 'teacherAssistant',
dateCreated: new Date(),
lastScheduledSession: '',
numberOfSessions: 1,
avgRating: 5,
country: 'Berlin'
}
]
    



HelpSession.insertMany(seedSessions)
.then(data => {
  console.log(`Success! ${data.length} Sessions added to the collection `);
  mongoose.connection.close();
})
.catch(err => {
  console.log(err);
})

// User.insertMany(seedUsers)
// .then(data => {
//   console.log(`Success! ${data.length} users added to the collection `);
//   mongoose.connection.close();
// })
// .catch(err => {
//   console.log(err);
// })