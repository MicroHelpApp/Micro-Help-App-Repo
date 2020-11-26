require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/micro-help-app-repo', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



//express-session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000
    })
  })
);

//passport configuration

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(dbUser => {
      done(null, dbUser);
    })
    .catch(err => {
      done(err);
    });
});

//normal signup/login
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then(found => {
        if (found === null) {
          done(null, false, { message: 'Wrong credentials' });
        } else if (!bcrypt.compareSync(password, found.password)) {
          done(null, false, { message: 'Wrong credentials' });
        } else {
          done(null, found);
        }
      })
      .catch(err => {
        done(err, false);
      });
  })
);

//google signup/login
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL 
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({googleId: profile.id})
      .then( data => {
          if (data !== null) {
            console.log('google user found')
            done(null, data);
          } else {
              console.log('new google user')
              return User.create({
                  googleId: profile.id,
                  username: profile._json.name
              })
              .then( data => {
                  done(null, data)
              })

          }
      })
      .catch(error => {
        done(error);
      })
  }
));





app.use(passport.initialize());
app.use(passport.session());

//end of passport



const index = require('./routes/index');
app.use('/', index);

const schedule = require('./routes/schedule')
app.use('/schedule', schedule)

const auth = require('./routes/auth')
app.use('/auth', auth)

const private = require('./routes/private')
app.use('/private', private)

const interactivity = require('./routes/interactivity')
app.use('/interactivity', interactivity)


module.exports = app;
